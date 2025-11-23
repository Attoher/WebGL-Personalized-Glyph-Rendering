"use strict";

const WebGLApp = {
    gl: null,
    program: null,
    buffers: null,
    uniforms: null,
    fieldOfViewRadians: Math.PI * 60 / 180,
    isInitialized: false,

    init: function() {
        try {
            const canvas = document.getElementById('canvas');
            if (!canvas) {
                this.showError('Canvas element not found');
                return;
            }

            this.gl = canvas.getContext('webgl');
            if (!this.gl) {
                this.showError('WebGL not supported');
                return;
            }

            // Buat program dengan shader yang benar
            this.program = this.createProgram();
            if (!this.program) {
                this.showError('Failed to create shader program');
                return;
            }

            this.buffers = Helper.initBuffers(this.gl, this.program);

            // Setup IO handlers
            IOHandler.setRotationCallback((rotation) => {
                this.drawScene();
            });

            // Tambahkan callback untuk scaling
            IOHandler.setScaleCallback((scale) => {
                this.drawScene();
            });

            IOHandler.setLightingModeCallback((isFixed) => {
                // Buat ulang program ketika mode berubah
                this.program = this.createProgram();
                this.buffers = Helper.initBuffers(this.gl, this.program);
                this.drawScene();
            });

            IOHandler.init();
            this.isInitialized = true;
            this.drawScene();
            
        } catch (error) {
            this.showError('Error: ' + error.message);
        }
    },

    createProgram: function() {
        const gl = this.gl;
        
        // Pilih shader berdasarkan mode
        const isFixed = IOHandler.isLightingFixed();
        const vertexShaderSource = isFixed ? this.getFixedVertexShader() : this.getDynamicVertexShader();
        const fragmentShaderSource = this.getFragmentShader();

        // Compile shaders - PERBAIKI TYPO DI SINI
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        if (!vertexShader || !fragmentShader) return null;

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking failed:', gl.getProgramInfoLog(program));
            return null;
        }

        // Setup uniforms berdasarkan mode
        this.setupUniforms(program, isFixed);
        return program;
    },

    getFixedVertexShader: function() {
        return `
            attribute vec4 a_position;
            attribute vec3 a_normal;

            uniform mat4 u_matrix;

            varying vec3 v_normal;

            void main() {
                gl_Position = u_matrix * a_position;
                // NORMAL TIDAK DI-TRANSFORM - Lighting FIXED!
                v_normal = a_normal;
            }
        `;
    },

    getDynamicVertexShader: function() {
        return `
            attribute vec4 a_position;
            attribute vec3 a_normal;

            uniform mat4 u_worldViewProjection;
            uniform mat4 u_world;

            varying vec3 v_normal;

            void main() {
                gl_Position = u_worldViewProjection * a_position;
                // NORMAL DI-TRANSFORM - Lighting DYNAMIC!
                v_normal = mat3(u_world) * a_normal;
            }
        `;
    },

    getFragmentShader: function() {
        return `
            precision mediump float;
            varying vec3 v_normal;
            uniform vec3 u_reverseLightDirection;
            uniform vec4 u_color;

            void main() {
                vec3 normal = normalize(v_normal);
                float light = dot(normal, u_reverseLightDirection);
                light = max(light, 0.2);
                gl_FragColor = u_color;
                gl_FragColor.rgb *= light;
            }
        `;
    },

    compileShader: function(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    },

    setupUniforms: function(program, isFixed) {
        const gl = this.gl;
        if (isFixed) {
            this.uniforms = {
                matrix: gl.getUniformLocation(program, 'u_matrix'),
                color: gl.getUniformLocation(program, 'u_color'),
                reverseLightDirection: gl.getUniformLocation(program, 'u_reverseLightDirection')
            };
        } else {
            this.uniforms = {
                worldViewProjection: gl.getUniformLocation(program, 'u_worldViewProjection'),
                world: gl.getUniformLocation(program, 'u_world'),
                color: gl.getUniformLocation(program, 'u_color'),
                reverseLightDirection: gl.getUniformLocation(program, 'u_reverseLightDirection')
            };
        }
    },

    showError: function(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        console.error(message);
    },

    drawScene: function() {
        if (!this.isInitialized) return;

        const gl = this.gl;
        const isFixed = IOHandler.isLightingFixed();

        try {
            webglUtils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clearColor(0.1, 0.1, 0.1, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.useProgram(this.program);

            Helper.setupVertexAttributes(gl, this.buffers);

            // Compute matrices - gunakan nilai dari SceneConfig
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const projectionMatrix = m4.perspective(SceneConfig.fieldOfViewRadians, aspect, SceneConfig.zNear, SceneConfig.zFar);
            const camera = SceneConfig.camera;
            const target = SceneConfig.target;
            const up = SceneConfig.up;
            const cameraMatrix = m4.lookAt(camera, target, up);
            const viewMatrix = m4.inverse(cameraMatrix);
            const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

            // Apply rotation and scaling
            let worldMatrix = m4.yRotation(IOHandler.getRotation());
            const scale = IOHandler.getScale();
            worldMatrix = m4.scale(worldMatrix, scale, scale, scale);

            if (isFixed) {
                // Fixed lighting: gabungkan semua matrix jadi satu
                const worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
                gl.uniformMatrix4fv(this.uniforms.matrix, false, worldViewProjectionMatrix);
            } else {
                // Dynamic lighting: kirim matrix terpisah
                const worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
                gl.uniformMatrix4fv(this.uniforms.worldViewProjection, false, worldViewProjectionMatrix);
                gl.uniformMatrix4fv(this.uniforms.world, false, worldMatrix);
            }

            gl.uniform4fv(this.uniforms.color, SceneConfig.color);
            
            // Gunakan fixed light direction dari SceneConfig
            const lightDir = SceneConfig.fixedLightDirection;
            gl.uniform3fv(this.uniforms.reverseLightDirection, m4.normalize(lightDir));
            
            // Hitung jumlah vertex yang tepat dari data
            const vertexCount = GeometryData.positions.length / 3;
            gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

        } catch (error) {
            this.showError('Draw error: ' + error.message);
        }
    }
};

window.addEventListener('load', () => {
    WebGLApp.init();
});
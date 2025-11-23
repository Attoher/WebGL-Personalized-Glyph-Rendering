const Helper = {
    radToDeg: function(r) {
        return r * 180 / Math.PI;
    },

    degToRad: function(d) {
        return d * Math.PI / 180;
    },

    initBuffers: function(gl, program) {
        const positionLocation = gl.getAttribLocation(program, "a_position");
        const normalLocation = gl.getAttribLocation(program, "a_normal");

        // Create and setup position buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        
        // Transform positions to center the F
        const transformedPositions = this.transformGeometry(GeometryData.positions);
        gl.bufferData(gl.ARRAY_BUFFER, transformedPositions, gl.STATIC_DRAW);

        // Create and setup normal buffer
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, GeometryData.normals, gl.STATIC_DRAW);

        return {
            positionBuffer: positionBuffer,
            normalBuffer: normalBuffer,
            positionLocation: positionLocation,
            normalLocation: normalLocation
        };
    },

    transformGeometry: function(positions) {
        const transformed = new Float32Array(positions.length);
        
        let matrix = m4.xRotation(Math.PI);
        matrix = m4.translate(matrix, -50, -75, -15);

        for (let ii = 0; ii < positions.length; ii += 3) {
            const vector = m4.transformPoint(
                matrix, 
                [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]
            );
            transformed[ii + 0] = vector[0];
            transformed[ii + 1] = vector[1];
            transformed[ii + 2] = vector[2];
        }

        return transformed;
    },

    setupVertexAttributes: function(gl, buffers) {
        gl.enableVertexAttribArray(buffers.positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
        gl.vertexAttribPointer(buffers.positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(buffers.normalLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalBuffer);
        gl.vertexAttribPointer(buffers.normalLocation, 3, gl.FLOAT, false, 0, 0);
    }
};
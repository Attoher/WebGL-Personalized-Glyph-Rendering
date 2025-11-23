const IOHandler = {
    rotationRadians: 0,
    scale: 1.0,
    isFixedLighting: true,
    onRotationChange: null,
    onScaleChange: null,
    onLightingModeChange: null,

    /**
     * Initialize event listeners for UI controls
     */
    init: function() {
        this.setupRotationControl();
        this.setupScaleControl();
        this.setupLightingToggle();
        
        // Set initial UI state
        this.updateLightingUI();
    },

    /**
     * Setup rotation slider control
     */
    setupRotationControl: function() {
        const rotationSlider = document.getElementById('rotationSlider');
        const rotationValue = document.getElementById('rotationValue');

        if (!rotationSlider || !rotationValue) {
            console.error('Rotation controls not found in DOM');
            return;
        }

        rotationSlider.addEventListener('input', (event) => {
            this.rotationRadians = Helper.degToRad(parseInt(event.target.value));
            rotationValue.textContent = event.target.value + '°';
            
            if (this.onRotationChange) {
                this.onRotationChange(this.rotationRadians);
            }
        });

        console.log('Rotation control initialized');
    },

    /**
     * Setup scale slider control
     */
    setupScaleControl: function() {
        const scaleSlider = document.getElementById('scaleSlider');
        const scaleValue = document.getElementById('scaleValue');

        if (!scaleSlider || !scaleValue) {
            console.error('Scale controls not found in DOM');
            return;
        }

        scaleSlider.addEventListener('input', (event) => {
            this.scale = parseFloat(event.target.value);
            scaleValue.textContent = this.scale.toFixed(2) + 'x';
            
            if (this.onScaleChange) {
                this.onScaleChange(this.scale);
            }
        });

        console.log('Scale control initialized');
    },

    /**
     * Setup lighting mode toggle
     */
    setupLightingToggle: function() {
        const lightingToggle = document.getElementById('lightingToggle');
        const lightingModeText = document.getElementById('lightingModeText');

        if (!lightingToggle || !lightingModeText) {
            console.error('Lighting toggle controls not found in DOM');
            return;
        }

        lightingToggle.addEventListener('change', (event) => {
            this.isFixedLighting = event.target.checked;
            this.updateLightingUI();
            
            if (this.onLightingModeChange) {
                this.onLightingModeChange(this.isFixedLighting);
            }
        });

        console.log('Lighting toggle initialized');
    },

    /**
     * Update UI based on lighting mode
     */
    updateLightingUI: function() {
        const fixedInfo = document.getElementById('fixedLightingInfo');
        const modeText = document.getElementById('lightingModeText');

        if (this.isFixedLighting) {
            // Fixed lighting mode
            if (fixedInfo) fixedInfo.style.display = 'block';
            if (modeText) modeText.textContent = 'ON (Fixed)';
        } else {
            // Dynamic lighting mode
            if (fixedInfo) fixedInfo.style.display = 'none';
            if (modeText) modeText.textContent = 'OFF (Dynamic)';
        }
    },

    /**
     * Set callback for rotation changes
     */
    setRotationCallback: function(callback) {
        this.onRotationChange = callback;
    },

    /**
     * Set callback for scale changes
     */
    setScaleCallback: function(callback) {
        this.onScaleChange = callback;
    },

    /**
     * Set callback for lighting mode changes
     */
    setLightingModeCallback: function(callback) {
        this.onLightingModeChange = callback;
    },

    /**
     * Get current rotation in radians
     */
    getRotation: function() {
        return this.rotationRadians;
    },

    /**
     * Get current scale
     */
    getScale: function() {
        return this.scale;
    },

    /**
     * Get current lighting mode
     */
    isLightingFixed: function() {
        return this.isFixedLighting;
    },

    /**
     * Get fixed light direction
     */
    getFixedLightDirection: function() {
        return [0.5, 0.7, 1];
    }
};
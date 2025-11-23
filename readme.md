# 3D Letters AT1 - WebGL Personalized Glyph Rendering

**Ath Thahir Muhammad Isa Rahmatullah**  
**NRP: 5025231181**

![WebGL 3D Rendering](https://img.shields.io/badge/WebGL-3D%20Rendering-orange)
![Interactive](https://img.shields.io/badge/Interactive-Controls-green)
![Responsive](https://img.shields.io/badge/Responsive-Design-blue)

## 📋 Project Overview

This project is an interactive 3D WebGL application that renders personalized glyphs "AT1" based on the case study requirements. It demonstrates advanced computer graphics techniques including 3D modeling, lighting, and real-time user interactions.

### 🎯 Case Study Implementation
- **Personalized Glyphs**: "AT" (first two letters of first name) + "1" (last digit of NRP)
- **3D Modeling**: Extruded letter geometry with proper normals
- **Interactive Controls**: Real-time rotation, scaling, and lighting modes
- **WebGL Implementation**: Hardware-accelerated 3D rendering

## ✨ Features

### 🎮 Interactive Controls
- **Rotation Control**: -360° to +360° real-time rotation
- **Object Scaling**: Dynamic scaling from 0.3x to 1.5x
- **Lighting Modes**: 
  - Fixed Lighting (predefined light direction)
  - Dynamic Lighting (light follows object rotation)

### 🎨 Visual Features
- **3D Extruded Letters**: Proper depth and perspective
- **Smooth Shading**: Normal-based lighting calculations
- **Responsive Design**: Mobile-friendly interface
- **Professional UI**: Clean, modern control panel

### 🔧 Technical Features
- **WebGL 1.0 Support**: Cross-browser compatibility
- **Optimized Rendering**: Efficient buffer management
- **Error Handling**: Graceful fallbacks for unsupported browsers
- **Modular Architecture**: Well-organized code structure

## 🚀 Live Demo

Open `index.html` in a modern web browser to run the application.

## 📁 Project Structure

```
3D-Letters-AT1/
│
├── index.html          # Main HTML file with UI structure
├── data.js            # Geometry data and scene configuration
├── main.js            # WebGL application core logic
├── helper.js          # Utility functions and buffer management
├── iohandler.js       # User input handling and UI controls
└── README.md          # Project documentation
```

## 🛠️ Technical Implementation

### Core Components

1. **Geometry Data** (`data.js`)
   - Vertex positions for "A", "T", and "1" characters
   - Normal vectors for lighting calculations
   - Scene configuration parameters

2. **WebGL Renderer** (`main.js`)
   - Shader program management (vertex & fragment shaders)
   - Matrix transformations and camera setup
   - Rendering pipeline configuration

3. **User Interface** (`iohandler.js`)
   - Event handling for sliders and toggles
   - Real-time parameter updates
   - State management

4. **Utilities** (`helper.js`)
   - Buffer initialization and management
   - Coordinate transformations
   - Mathematical helpers

### Shader Programs

**Fixed Lighting Vertex Shader:**
```glsl
attribute vec4 a_position;
attribute vec3 a_normal;
uniform mat4 u_matrix;
varying vec3 v_normal;
```

**Dynamic Lighting Vertex Shader:**
```glsl
attribute vec4 a_position;
attribute vec3 a_normal;
uniform mat4 u_worldViewProjection;
uniform mat4 u_world;
varying vec3 v_normal;
```

## 🎯 Usage Instructions

### Basic Controls
1. **Rotation**: Use the rotation slider to spin the 3D object
2. **Scaling**: Adjust the scale slider to resize the object
3. **Lighting**: Toggle between fixed and dynamic lighting modes

### Lighting Modes
- **Fixed Lighting**: Light direction remains constant (X: 0.5, Y: 0.7, Z: 1.0)
- **Dynamic Lighting**: Light direction updates with object rotation

## 🔧 Browser Compatibility

| Browser | WebGL Support | Status |
|---------|---------------|--------|
| Chrome 70+ | ✅ | Fully Supported |
| Firefox 65+ | ✅ | Fully Supported |
| Edge 79+ | ✅ | Fully Supported |
| Safari 12+ | ✅ | Fully Supported |

## 🎓 Educational Value

This project demonstrates:
- 3D computer graphics fundamentals
- WebGL programming and shader development
- 3D transformation matrices
- Lighting and normal calculations
- Interactive 3D application design
- Responsive web development
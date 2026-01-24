// 3D File Viewer using Three.js

class ThreeDViewer {
    constructor() {
        this.container = document.getElementById('threejsCanvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.mesh = null;
        this.wireframe = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Create camera
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Add lights
        this.setupLights();
        
        // Add controls
        this.setupControls();
        
        // Add grid
        this.addGrid();
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation loop
        this.animate();
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        
        // Point light
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-10, 10, -5);
        this.scene.add(pointLight);
    }
    
    setupControls() {
        // Simple orbit controls implementation
        this.controls = {
            enabled: true,
            rotationSpeed: 0.005,
            zoomSpeed: 0.1,
            autoRotate: false,
            autoRotateSpeed: 0.01
        };
        
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        this.renderer.domElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (!isDragging || !this.controls.enabled) return;
            
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            
            if (this.mesh) {
                this.mesh.rotation.y += deltaMove.x * this.controls.rotationSpeed;
                this.mesh.rotation.x += deltaMove.y * this.controls.rotationSpeed;
            }
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        this.renderer.domElement.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        this.renderer.domElement.addEventListener('wheel', (e) => {
            if (!this.controls.enabled) return;
            
            e.preventDefault();
            const delta = e.deltaY * this.controls.zoomSpeed;
            this.camera.position.z += delta;
            this.camera.position.z = Math.max(1, Math.min(20, this.camera.position.z));
        });
        
        // Touch events for mobile
        let touchStart = { x: 0, y: 0 };
        
        this.renderer.domElement.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        });
        
        this.renderer.domElement.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && this.mesh) {
                e.preventDefault();
                const touch = e.touches[0];
                const deltaMove = {
                    x: touch.clientX - touchStart.x,
                    y: touch.clientY - touchStart.y
                };
                
                this.mesh.rotation.y += deltaMove.x * this.controls.rotationSpeed;
                this.mesh.rotation.x += deltaMove.y * this.controls.rotationSpeed;
                
                touchStart = { x: touch.clientX, y: touch.clientY };
            }
        });
    }
    
    addGrid() {
        const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xcccccc);
        gridHelper.position.y = -2;
        this.scene.add(gridHelper);
    }
    
    loadFile(file) {
        // For demo purposes, create a sample geometry
        // In a real implementation, you would use STL/OBJ loaders
        
        // Clear existing mesh
        if (this.mesh) {
            this.scene.remove(this.mesh);
        }
        
        // Create sample geometry based on file type
        let geometry;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        switch (fileExtension) {
            case 'stl':
                // Create a complex geometry for STL
                geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
                break;
            case 'obj':
                // Create a different geometry for OBJ
                geometry = new THREE.IcosahedronGeometry(1.5, 1);
                break;
            case 'step':
            case 'stp':
                // Create a technical-looking geometry for STEP
                geometry = new THREE.BoxGeometry(2, 1, 1.5);
                break;
            case '3mf':
                // Create another geometry for 3MF
                geometry = new THREE.OctahedronGeometry(1.5);
                break;
            default:
                geometry = new THREE.SphereGeometry(1);
        }
        
        // Create material
        const material = new THREE.MeshPhongMaterial({
            color: 0xff6b35,
            specular: 0x111111,
            shininess: 100,
            wireframe: this.wireframe
        });
        
        // Create mesh
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Center the mesh
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        this.mesh.position.sub(center);
        
        // Add to scene
        this.scene.add(this.mesh);
        
        // Update file info
        this.updateFileInfo(geometry);
        
        // Show viewer section
        const viewerSection = document.getElementById('viewer');
        if (viewerSection) {
            viewerSection.classList.remove('hidden');
        }
    }
    
    updateFileInfo(geometry) {
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        
        // Calculate volume (approximate)
        const volume = this.calculateVolume(geometry);
        
        // Calculate surface area (approximate)
        const surfaceArea = this.calculateSurfaceArea(geometry);
        
        // Update UI
        const dimensionsElement = document.getElementById('modelDimensions');
        const volumeElement = document.getElementById('modelVolume');
        const surfaceElement = document.getElementById('modelSurface');
        
        if (dimensionsElement) {
            dimensionsElement.textContent = `${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)} mm`;
        }
        
        if (volumeElement) {
            volumeElement.textContent = `${volume.toFixed(2)} cm³`;
        }
        
        if (surfaceElement) {
            surfaceElement.textContent = `${surfaceArea.toFixed(2)} cm²`;
        }
    }
    
    calculateVolume(geometry) {
        // Simplified volume calculation
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        
        // This is a rough approximation - real volume calculation would be more complex
        return (size.x * size.y * size.z) * 0.6; // Assume 60% of bounding box
    }
    
    calculateSurfaceArea(geometry) {
        // Simplified surface area calculation
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        
        // This is a rough approximation
        return 2 * (size.x * size.y + size.x * size.z + size.y * size.z) * 0.8; // Assume 80% of bounding box
    }
    
    toggleWireframe() {
        this.wireframe = !this.wireframe;
        if (this.mesh) {
            this.mesh.material.wireframe = this.wireframe;
        }
    }
    
    resetView() {
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);
        
        if (this.mesh) {
            this.mesh.rotation.set(0, 0, 0);
        }
    }
    
    onWindowResize() {
        if (!this.container) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Auto-rotate if enabled
        if (this.controls.autoRotate && this.mesh) {
            this.mesh.rotation.y += this.controls.autoRotateSpeed;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Clean up event listeners
        window.removeEventListener('resize', this.onWindowResize);
    }
}

// Initialize 3D viewer
let viewer3D;

document.addEventListener('DOMContentLoaded', () => {
    viewer3D = new ThreeDViewer();
    
    // Setup viewer controls
    const resetButton = document.querySelector('[title="Reset View"]');
    const wireframeButton = document.querySelector('[title="Wireframe"]');
    const fullscreenButton = document.querySelector('[title="Fullscreen"]');
    
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            viewer3D.resetView();
        });
    }
    
    if (wireframeButton) {
        wireframeButton.addEventListener('click', () => {
            viewer3D.toggleWireframe();
        });
    }
    
    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', () => {
            const container = document.getElementById('threejsCanvas');
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        });
    }
});

// Function to load a file in the viewer
function loadFileInViewer(file) {
    if (viewer3D) {
        viewer3D.loadFile(file);
    }
}

// Make viewer available globally
window.viewer3D = viewer3D;
window.loadFileInViewer = loadFileInViewer;

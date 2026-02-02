// Dashboard Scene - B2B Tool
// Floating glass panel with depth perspective

class DashboardScene {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.panel = null;
        this.dataPoints = [];
        this.progress = 0;

        this.init();
    }

    init() {
        // Create floating panel
        const panelGeometry = new THREE.PlaneGeometry(60, 35);
        const panelMaterial = new THREE.MeshBasicMaterial({
            color: 0x141420,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });

        this.panel = new THREE.Mesh(panelGeometry, panelMaterial);
        this.panel.position.z = -10;
        this.scene.add(this.panel);

        // Create border glow
        const borderGeometry = new THREE.EdgesGeometry(panelGeometry);
        const borderMaterial = new THREE.LineBasicMaterial({
            color: 0xa78bfa,
            transparent: true,
            opacity: 0.6
        });
        const border = new THREE.LineSegments(borderGeometry, borderMaterial);
        border.position.z = -9.9;
        this.scene.add(border);
        this.border = border;

        // Create animated data visualization bars
        for (let i = 0; i < 3; i++) {
            const height = 10 + Math.random() * 15;
            const barGeometry = new THREE.BoxGeometry(3, height, 1);
            const barMaterial = new THREE.MeshBasicMaterial({
                color: 0xc4b5fd,
                transparent: true,
                opacity: 0.7
            });

            const bar = new THREE.Mesh(barGeometry, barMaterial);
            bar.position.set(-20 + i * 20, -5 + height / 2, -9);

            this.scene.add(bar);
            this.dataPoints.push({ mesh: bar, targetHeight: height, currentHeight: 0 });
        }

        // Listen for section progress
        const dashboardSection = document.getElementById('dashboard');
        dashboardSection.addEventListener('sectionProgress', (e) => {
            this.progress = e.detail.progress;
        });
    }

    update(time) {
        const dashboardSection = document.getElementById('dashboard');
        const rect = dashboardSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isInView) {
            this.panel.material.opacity = 0;
            this.border.material.opacity = 0;
            this.dataPoints.forEach(point => {
                point.mesh.material.opacity = 0;
            });
            return;
        }

        // Fade in
        const fadeProgress = Math.min(this.progress * 2, 1);
        this.panel.material.opacity = 0.4 * fadeProgress;
        this.border.material.opacity = 0.6 * fadeProgress;

        // Gentle floating
        const float = Math.sin(time * 0.5) * 2;
        this.panel.position.y = float;
        this.border.position.y = float;

        // Subtle rotation for depth
        this.panel.rotation.y = Math.sin(time * 0.3) * 0.1;
        this.border.rotation.y = Math.sin(time * 0.3) * 0.1;

        // Animate data bars growing
        this.dataPoints.forEach((point, index) => {
            point.mesh.material.opacity = 0.7 * fadeProgress;
            point.mesh.position.y = float - 5 + point.currentHeight / 2;

            // Grow animation
            if (point.currentHeight < point.targetHeight && fadeProgress > 0.5) {
                point.currentHeight += 0.3;
                const newGeometry = new THREE.BoxGeometry(3, point.currentHeight, 1);
                point.mesh.geometry.dispose();
                point.mesh.geometry = newGeometry;
            }

            // Pulse effect
            const pulse = Math.sin(time * 2 + index) * 0.1 + 1;
            point.mesh.scale.set(pulse, 1, 1);
        });
    }

    dispose() {
        this.scene.remove(this.panel);
        this.scene.remove(this.border);
        this.dataPoints.forEach(point => {
            this.scene.remove(point.mesh);
        });
    }
}

export default DashboardScene;

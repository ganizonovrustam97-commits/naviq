// Scale Scene - Market Size
// 3D concentric rings for TAM/SAM/SOM visualization

class ScaleScene {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.rings = [];
        this.progress = 0;
        this.selectedSegment = null;

        this.init();
    }

    init() {
        // Create three concentric rings
        const ringData = [
            { radius: 40, color: 0xa78bfa, opacity: 0.3, label: 'TAM', height: 0 },
            { radius: 28, color: 0xc4b5fd, opacity: 0.5, label: 'SAM', height: 3 },
            { radius: 18, color: 0xe9d5ff, opacity: 0.7, label: 'SOM', height: 6 }
        ];

        ringData.forEach((data, index) => {
            // Create ring geometry
            const geometry = new THREE.RingGeometry(data.radius - 2, data.radius, 64);
            const material = new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: data.opacity,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = data.height;

            // Create edge glow
            const edgeGeometry = new THREE.RingGeometry(data.radius - 0.3, data.radius + 0.3, 64);
            const edgeMaterial = new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
            edge.rotation.x = -Math.PI / 2;
            edge.position.y = data.height + 0.1;

            this.scene.add(ring);
            this.scene.add(edge);

            this.rings.push({ mesh: ring, edge, data });
        });

        // Handle segment clicks
        const dataPoints = document.querySelectorAll('.data-point');
        dataPoints.forEach(point => {
            point.addEventListener('mouseenter', () => {
                this.selectedSegment = point.dataset.segment;
            });

            point.addEventListener('mouseleave', () => {
                this.selectedSegment = null;
            });
        });

        // Listen for section progress
        const scaleSection = document.getElementById('scale');
        scaleSection.addEventListener('sectionProgress', (e) => {
            this.progress = e.detail.progress;
        });
    }

    update(time) {
        const scaleSection = document.getElementById('scale');
        const rect = scaleSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isInView) {
            this.rings.forEach(ring => {
                ring.mesh.material.opacity = 0;
                ring.edge.material.opacity = 0;
            });
            return;
        }

        // Fade in
        const fadeProgress = Math.min(this.progress * 2, 1);

        this.rings.forEach((ring, index) => {
            // Base opacity
            ring.mesh.material.opacity = ring.data.opacity * fadeProgress;
            ring.edge.material.opacity = 0.8 * fadeProgress;

            // Highlight selected segment
            const segmentMap = { 'tam': 0, 'sam': 1, 'som': 2 };
            if (this.selectedSegment && segmentMap[this.selectedSegment] === index) {
                ring.mesh.material.opacity = Math.min(ring.data.opacity * 2, 1);
                ring.edge.material.opacity = 1;

                // Scale up
                const scale = 1.1;
                ring.mesh.scale.set(scale, scale, scale);
                ring.edge.scale.set(scale, scale, scale);
            } else {
                ring.mesh.scale.set(1, 1, 1);
                ring.edge.scale.set(1, 1, 1);
            }

            // Gentle rotation
            ring.mesh.rotation.z = time * 0.1 * (index + 1) * 0.2;
            ring.edge.rotation.z = time * 0.1 * (index + 1) * 0.2;

            // Floating animation
            const float = Math.sin(time + index) * 0.5;
            ring.mesh.position.y = ring.data.height + float;
            ring.edge.position.y = ring.data.height + float + 0.1;
        });
    }

    dispose() {
        this.rings.forEach(ring => {
            this.scene.remove(ring.mesh);
            this.scene.remove(ring.edge);
        });
    }
}

export default ScaleScene;

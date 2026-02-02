// Roadmap Scene  
// Animated timeline with glowing path

class RoadmapScene {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.timelinePath = null;
        this.milestones = [];
        this.progress = 0;

        this.init();
    }

    init() {
        // Create timeline path
        const curve = new THREE.LineCurve3(
            new THREE.Vector3(-50, 0, 0),
            new THREE.Vector3(50, 0, 0)
        );

        const points = curve.getPoints(100);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xa78bfa,
            linewidth: 2,
            transparent: true,
            opacity: 0.6
        });

        this.timelinePath = new THREE.Line(geometry, material);
        this.scene.add(this.timelinePath);

        // Create milestone markers (Q1, Q2-Q3, Q4)
        const milestonePositions = [-30, 0, 30];

        milestonePositions.forEach((x, index) => {
            // Create sphere marker
            const geometry = new THREE.SphereGeometry(2, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                color: 0xc4b5fd,
                transparent: true,
                opacity: 0.9
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(x, 0, 0);

            // Add glow ring
            const ringGeometry = new THREE.RingGeometry(3, 4, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xa78bfa,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.set(x, 0, 0);
            ring.rotation.x = Math.PI / 2;

            this.scene.add(sphere);
            this.scene.add(ring);

            this.milestones.push({ sphere, ring, x });
        });

        // Listen for section progress
        const roadmapSection = document.getElementById('roadmap');
        if (roadmapSection) {
            roadmapSection.addEventListener('sectionProgress', (e) => {
                this.progress = e.detail.progress;
            });
        }
    }

    update(time) {
        const roadmapSection = document.getElementById('roadmap');
        if (!roadmapSection) return;

        const rect = roadmapSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isInView) {
            this.timelinePath.material.opacity = 0;
            this.milestones.forEach(m => {
                m.sphere.material.opacity = 0;
                m.ring.material.opacity = 0;
            });
            return;
        }

        // Fade in
        const fadeProgress = Math.min(this.progress * 2, 1);
        this.timelinePath.material.opacity = 0.6 * fadeProgress;

        // Animate path drawing
        const drawProgress = this.progress;
        this.timelinePath.position.x = -50 + drawProgress * 10;

        // Pulse milestones
        this.milestones.forEach((milestone, index) => {
            const pulse = Math.sin(time * 2 + index * 0.8) * 0.5 + 0.5;
            const scale = 1 + pulse * 0.3;
            milestone.sphere.scale.set(scale, scale, scale);
            milestone.sphere.material.opacity = 0.9 * fadeProgress;

            // Rotate rings
            milestone.ring.rotation.z = time * 0.5 + index;
            milestone.ring.material.opacity = 0.5 * fadeProgress;

            // Scale rings
            const ringScale = 1 + pulse * 0.2;
            milestone.ring.scale.set(ringScale, ringScale, ringScale);
        });
    }

    dispose() {
        this.scene.remove(this.timelinePath);
        this.milestones.forEach(m => {
            this.scene.remove(m.sphere);
            this.scene.remove(m.ring);
        });
    }
}

export default RoadmapScene;

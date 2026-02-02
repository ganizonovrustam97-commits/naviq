// Guidance Scene - The Path
// Light path with camera flight animation

class GuidanceScene {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.pathLine = null;
        this.milestones = [];
        this.progress = 0;

        this.init();
    }

    init() {
        // Create path curve
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-40, 0, 20),
            new THREE.Vector3(-20, 10, 0),
            new THREE.Vector3(0, 5, -10),
            new THREE.Vector3(20, 15, 0),
            new THREE.Vector3(40, 10, 20)
        ]);

        // Create glowing line geometry
        const points = curve.getPoints(200);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // Create line material with glow
        const material = new THREE.LineBasicMaterial({
            color: 0xa78bfa,
            linewidth: 3,
            transparent: true,
            opacity: 0.8
        });

        this.pathLine = new THREE.Line(geometry, material);
        this.scene.add(this.pathLine);

        // Create milestone markers
        const milestonePositions = [
            { pos: new THREE.Vector3(-20, 10, 0), label: 'Quest' },
            { pos: new THREE.Vector3(0, 5, -10), label: 'Simulation' },
            { pos: new THREE.Vector3(20, 15, 0), label: 'Offer' }
        ];

        milestonePositions.forEach(milestone => {
            const geometry = new THREE.SphereGeometry(1.5, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                color: 0xc4b5fd,
                transparent: true,
                opacity: 0.9
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(milestone.pos);

            // Add glow ring
            const ringGeometry = new THREE.RingGeometry(2, 2.5, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xa78bfa,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.copy(milestone.pos);
            ring.lookAt(this.camera.position);

            this.scene.add(sphere);
            this.scene.add(ring);

            this.milestones.push({ sphere, ring, label: milestone.label });
        });

        // Listen for section progress
        const guidanceSection = document.getElementById('guidance');
        guidanceSection.addEventListener('sectionProgress', (e) => {
            this.progress = e.detail.progress;
        });
    }

    update(time) {
        const guidanceSection = document.getElementById('guidance');
        const rect = guidanceSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isInView) {
            this.pathLine.material.opacity = 0;
            this.milestones.forEach(m => {
                m.sphere.material.opacity = 0;
                m.ring.material.opacity = 0;
            });
            return;
        }

        // Fade in
        const fadeProgress = Math.min(this.progress * 2, 1);
        this.pathLine.material.opacity = 0.8 * fadeProgress;

        // Animate camera along path
        if (this.progress > 0 && this.progress < 1) {
            // Camera movement is subtle, not flying along path
            // Just slight position shift for depth
            const offset = Math.sin(this.progress * Math.PI) * 5;
            this.pathLine.position.z = -offset;
        }

        // Pulse milestones
        this.milestones.forEach((milestone, index) => {
            const pulse = Math.sin(time * 2 + index) * 0.5 + 0.5;
            const scale = 1 + pulse * 0.2;
            milestone.sphere.scale.set(scale, scale, scale);
            milestone.sphere.material.opacity = 0.9 * fadeProgress;

            // Rotate rings
            milestone.ring.rotation.z = time * 0.5;
            milestone.ring.material.opacity = 0.5 * fadeProgress;
            milestone.ring.lookAt(this.camera.position);
        });
    }

    dispose() {
        this.scene.remove(this.pathLine);
        this.milestones.forEach(m => {
            this.scene.remove(m.sphere);
            this.scene.remove(m.ring);
        });
    }
}

export default GuidanceScene;

// Team Scene
// Orbiting particle rings representing team collaboration

class TeamScene {
    constructor(scene) {
        this.scene = scene;
        this.rings = [];
        this.progress = 0;

        this.init();
    }

    init() {
        // Create particle rings for team members (4 rings)
        const ringCount = 4;
        const particlesPerRing = 40;

        for (let r = 0; r < ringCount; r++) {
            const radius = 15 + r * 8;
            const geometry = new THREE.BufferGeometry();
            const positions = [];

            for (let i = 0; i < particlesPerRing; i++) {
                const angle = (i / particlesPerRing) * Math.PI * 2;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const z = (Math.random() - 0.5) * 5;

                positions.push(x, y, z);
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

            const material = new THREE.PointsMaterial({
                color: 0xa78bfa + r * 0x101010,
                size: 1.5,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending
            });

            const ring = new THREE.Points(geometry, material);
            this.scene.add(ring);

            this.rings.push({
                mesh: ring,
                radius,
                speed: 0.2 + r * 0.1,
                direction: r % 2 === 0 ? 1 : -1
            });
        }

        // Add central glowing sphere (team core)
        const coreGeometry = new THREE.SphereGeometry(3, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0xc4b5fd,
            transparent: true,
            opacity: 0.6
        });
        this.core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.scene.add(this.core);

        // Listen for section progress
        const teamSection = document.getElementById('team');
        if (teamSection) {
            teamSection.addEventListener('sectionProgress', (e) => {
                this.progress = e.detail.progress;
            });
        }
    }

    update(time) {
        const teamSection = document.getElementById('team');
        if (!teamSection) return;

        const rect = teamSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isInView) {
            this.rings.forEach(ring => {
                ring.mesh.material.opacity = 0;
            });
            if (this.core) this.core.material.opacity = 0;
            return;
        }

        // Fade in
        const fadeProgress = Math.min(this.progress * 2, 1);

        // Rotate rings
        this.rings.forEach((ring, index) => {
            ring.mesh.rotation.z = time * ring.speed * ring.direction;
            ring.mesh.material.opacity = 0.7 * fadeProgress;

            // Pulse effect
            const pulse = Math.sin(time * 2 + index * 0.5) * 0.1 + 1;
            ring.mesh.scale.set(pulse, pulse, pulse);
        });

        // Pulse core
        if (this.core) {
            const corePulse = Math.sin(time * 3) * 0.3 + 1;
            this.core.scale.set(corePulse, corePulse, corePulse);
            this.core.material.opacity = 0.6 * fadeProgress;
            this.core.rotation.y = time * 0.5;
        }
    }

    dispose() {
        this.rings.forEach(ring => {
            this.scene.remove(ring.mesh);
            ring.mesh.geometry.dispose();
            ring.mesh.material.dispose();
        });
        if (this.core) {
            this.scene.remove(this.core);
            this.core.geometry.dispose();
            this.core.material.dispose();
        }
    }
}

export default TeamScene;

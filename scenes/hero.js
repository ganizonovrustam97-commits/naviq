// Hero Scene - The Core
// Interactive 3D particle sphere that disintegrates on scroll

import ParticleSystem from '../utils/particles.js';

class HeroScene {
    constructor(scene) {
        this.scene = scene;
        this.particleSystem = null;
        this.spherePositions = [];
        this.explodedPositions = [];
        this.progress = 0;
        this.hoverIntensity = 0;

        this.init();
    }

    init() {
        const particleCount = 8000;

        // Create particle system
        this.particleSystem = new ParticleSystem(this.scene, particleCount, {
            color: 0xa78bfa,
            size: 1.5,
            range: 200,
            opacity: 0.9
        });

        // Generate sphere positions
        this.generateSpherePositions(particleCount);
        this.generateExplodedPositions(particleCount);

        // Set initial sphere formation
        const positions = this.particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = this.spherePositions[i];
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;

        // Listen for mouse movement
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.particleSystem.updateMouse(x, y);
        });

        // Listen for section progress
        const heroSection = document.getElementById('hero');
        heroSection.addEventListener('sectionProgress', (e) => {
            this.progress = e.detail.progress;
        });
    }

    generateSpherePositions(count) {
        const radius = 25;

        for (let i = 0; i < count; i++) {
            // Fibonacci sphere distribution for even spacing
            const phi = Math.acos(1 - 2 * (i + 0.5) / count);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            this.spherePositions.push(x, y, z);
        }
    }

    generateExplodedPositions(count) {
        for (let i = 0; i < count; i++) {
            // Exploded positions - particles fly outward
            const index = i * 3;
            const direction = new THREE.Vector3(
                this.spherePositions[index],
                this.spherePositions[index + 1],
                this.spherePositions[index + 2]
            ).normalize();

            const distance = 50 + Math.random() * 100;
            this.explodedPositions.push(
                direction.x * distance,
                direction.y * distance,
                direction.z * distance
            );
        }
    }

    update(time) {
        // Pulsing effect on hover
        const heroSection = document.getElementById('hero');
        const rect = heroSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInView) {
            // Gentle pulse
            const pulse = Math.sin(time * 2) * 0.5 + 0.5;
            const scale = 1 + pulse * 0.05;
            this.particleSystem.particles.scale.set(scale, scale, scale);

            // Rotation
            this.particleSystem.particles.rotation.y = time * 0.1;
            this.particleSystem.particles.rotation.x = Math.sin(time * 0.5) * 0.1;
        }

        // Morph between sphere and exploded state based on scroll
        const morphProgress = Math.min(this.progress * 2, 1);
        const positions = this.particleSystem.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i++) {
            const spherePos = this.spherePositions[i];
            const explodedPos = this.explodedPositions[i];
            const targetPos = spherePos + (explodedPos - spherePos) * morphProgress;

            positions[i] += (targetPos - positions[i]) * 0.05;
        }

        this.particleSystem.geometry.attributes.position.needsUpdate = true;

        // Update opacity based on scroll
        this.particleSystem.setOpacity(1 - morphProgress * 0.7);
    }

    dispose() {
        this.particleSystem.dispose();
    }
}

export default HeroScene;

// Chaos Scene - The Pain
// Chaotic particle movement with text emergence

import ParticleSystem from '../utils/particles.js';

class ChaosScene {
    constructor(scene) {
        this.scene = scene;
        this.particleSystem = null;
        this.chaosPositions = [];
        this.orderedPositions = [];
        this.activeItem = null;
        this.progress = 0;

        this.init();
    }

    init() {
        const particleCount = 5000;

        // Create particle system with more erratic movement
        this.particleSystem = new ParticleSystem(this.scene, particleCount, {
            color: 0xc4b5fd,
            size: 1.2,
            range: 150,
            opacity: 0.6
        });

        // Generate chaos and ordered positions
        this.generateChaosPositions(particleCount);
        this.generateOrderedPositions(particleCount);

        // Setup hover interactions
        const painItems = document.querySelectorAll('.pain-item');
        painItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.activeItem = item.dataset.chaos;
            });

            item.addEventListener('mouseleave', () => {
                this.activeItem = null;
            });
        });

        // Listen for section progress
        const chaosSection = document.getElementById('chaos');
        chaosSection.addEventListener('sectionProgress', (e) => {
            this.progress = e.detail.progress;
        });
    }

    generateChaosPositions(count) {
        for (let i = 0; i < count; i++) {
            // Random chaotic distribution
            this.chaosPositions.push(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );
        }
    }

    generateOrderedPositions(count) {
        // Grid-like ordered structure
        const gridSize = Math.ceil(Math.cbrt(count));
        const spacing = 5;

        for (let i = 0; i < count; i++) {
            const x = (i % gridSize) * spacing - (gridSize * spacing) / 2;
            const y = (Math.floor(i / gridSize) % gridSize) * spacing - (gridSize * spacing) / 2;
            const z = (Math.floor(i / (gridSize * gridSize))) * spacing - (gridSize * spacing) / 2;

            this.orderedPositions.push(x, y, z);
        }
    }

    update(time) {
        const chaosSection = document.getElementById('chaos');
        const rect = chaosSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isInView) {
            this.particleSystem.setOpacity(0);
            return;
        }

        // Fade in based on scroll progress
        const fadeProgress = Math.min(this.progress * 2, 1);
        this.particleSystem.setOpacity(0.6 * fadeProgress);

        const positions = this.particleSystem.geometry.attributes.position.array;
        const velocities = this.particleSystem.geometry.attributes.velocity.array;

        // Determine target positions based on hover state
        const targetPositions = this.activeItem ? this.orderedPositions : this.chaosPositions;
        const morphSpeed = this.activeItem ? 0.08 : 0.02;

        for (let i = 0; i < positions.length; i += 3) {
            // Morph to target
            positions[i] += (targetPositions[i] - positions[i]) * morphSpeed;
            positions[i + 1] += (targetPositions[i + 1] - positions[i + 1]) * morphSpeed;
            positions[i + 2] += (targetPositions[i + 2] - positions[i + 2]) * morphSpeed;

            // Add chaotic movement when not ordered
            if (!this.activeItem) {
                velocities[i] += (Math.random() - 0.5) * 0.2;
                velocities[i + 1] += (Math.random() - 0.5) * 0.2;
                velocities[i + 2] += (Math.random() - 0.5) * 0.2;

                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];

                velocities[i] *= 0.95;
                velocities[i + 1] *= 0.95;
                velocities[i + 2] *= 0.95;
            }
        }

        this.particleSystem.geometry.attributes.position.needsUpdate = true;

        // Rotate slowly
        this.particleSystem.particles.rotation.y = time * 0.05;
    }

    dispose() {
        this.particleSystem.dispose();
    }
}

export default ChaosScene;

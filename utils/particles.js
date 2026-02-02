// Particle System Module
// Reusable particle creation and force field calculations

class ParticleSystem {
    constructor(scene, count, options = {}) {
        this.scene = scene;
        this.count = count;
        this.particles = null;
        this.geometry = null;
        this.material = null;

        // Options with defaults
        this.options = {
            color: options.color || 0x6366f1,
            size: options.size || 2,
            range: options.range || 100,
            opacity: options.opacity || 0.8,
            ...options
        };

        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        // Create geometry
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.count * 3);
        const velocities = new Float32Array(this.count * 3);

        for (let i = 0; i < this.count * 3; i += 3) {
            // Random position in space
            positions[i] = (Math.random() - 0.5) * this.options.range;
            positions[i + 1] = (Math.random() - 0.5) * this.options.range;
            positions[i + 2] = (Math.random() - 0.5) * this.options.range;

            // Random initial velocity
            velocities[i] = (Math.random() - 0.5) * 0.1;
            velocities[i + 1] = (Math.random() - 0.5) * 0.1;
            velocities[i + 2] = (Math.random() - 0.5) * 0.1;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        // Create material
        this.material = new THREE.PointsMaterial({
            color: this.options.color,
            size: this.options.size,
            transparent: true,
            opacity: this.options.opacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // Create particle system
        this.particles = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particles);
    }

    updateMouse(x, y) {
        this.mouse.x = x;
        this.mouse.y = y;
    }

    applyForce(index, force) {
        const velocities = this.geometry.attributes.velocity.array;
        velocities[index] += force.x;
        velocities[index + 1] += force.y;
        velocities[index + 2] += force.z;
    }

    update(time, mouseInfluence = 0.02) {
        const positions = this.geometry.attributes.position.array;
        const velocities = this.geometry.attributes.velocity.array;

        for (let i = 0; i < this.count * 3; i += 3) {
            // Apply velocity
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            // Mouse attraction
            const dx = this.mouse.x * 50 - positions[i];
            const dy = this.mouse.y * 50 - positions[i + 1];
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 30) {
                velocities[i] += dx * mouseInfluence;
                velocities[i + 1] += dy * mouseInfluence;
            }

            // Apply damping
            velocities[i] *= 0.98;
            velocities[i + 1] *= 0.98;
            velocities[i + 2] *= 0.98;

            // Boundary constraints
            if (Math.abs(positions[i]) > this.options.range / 2) {
                velocities[i] *= -0.5;
            }
            if (Math.abs(positions[i + 1]) > this.options.range / 2) {
                velocities[i + 1] *= -0.5;
            }
            if (Math.abs(positions[i + 2]) > this.options.range / 2) {
                velocities[i + 2] *= -0.5;
            }
        }

        this.geometry.attributes.position.needsUpdate = true;
    }

    morph(targetPositions, speed = 0.05) {
        const positions = this.geometry.attributes.position.array;

        for (let i = 0; i < this.count * 3; i += 3) {
            positions[i] += (targetPositions[i] - positions[i]) * speed;
            positions[i + 1] += (targetPositions[i + 1] - positions[i + 1]) * speed;
            positions[i + 2] += (targetPositions[i + 2] - positions[i + 2]) * speed;
        }

        this.geometry.attributes.position.needsUpdate = true;
    }

    setOpacity(opacity) {
        this.material.opacity = opacity;
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
        this.scene.remove(this.particles);
    }
}

export default ParticleSystem;

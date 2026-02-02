// Business Model Scene
// Floating coins/money symbols with revenue streams visualization

class BusinessScene {
    constructor(scene) {
        this.scene = scene;
        this.coins = [];
        this.progress = 0;

        this.init();
    }

    init() {
        // Create floating currency symbols
        const symbols = ['$', '€', '₽'];
        const colors = [0x6366f1, 0x818cf8, 0xa5b4fc];

        for (let i = 0; i < 30; i++) {
            // Create text sprite for currency
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 128;
            canvas.height = 128;

            context.font = '80px Arial';
            context.fillStyle = '#a78bfa';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(symbols[i % symbols.length], 64, 64);

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0.6
            });

            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 40
            );
            sprite.scale.set(5, 5, 1);

            this.scene.add(sprite);
            this.coins.push({
                mesh: sprite,
                velocity: {
                    y: Math.random() * 0.05 + 0.02,
                    rotation: (Math.random() - 0.5) * 0.02
                },
                initialY: sprite.position.y
            });
        }

        // Listen for section progress
        const businessSection = document.getElementById('business');
        if (businessSection) {
            businessSection.addEventListener('sectionProgress', (e) => {
                this.progress = e.detail.progress;
            });
        }
    }

    update(time) {
        const businessSection = document.getElementById('business');
        if (!businessSection) return;

        const rect = businessSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isInView) {
            this.coins.forEach(coin => {
                coin.mesh.material.opacity = 0;
            });
            return;
        }

        // Fade in
        const fadeProgress = Math.min(this.progress * 2, 1);

        this.coins.forEach((coin, index) => {
            // Floating animation
            coin.mesh.position.y += coin.velocity.y;

            // Reset position if too high
            if (coin.mesh.position.y > 40) {
                coin.mesh.position.y = -40;
            }

            // Rotation
            coin.mesh.rotation.z += coin.velocity.rotation;

            // Opacity
            coin.mesh.material.opacity = 0.4 * fadeProgress;

            // Pulse effect
            const pulse = Math.sin(time * 2 + index * 0.5) * 0.2 + 1;
            coin.mesh.scale.set(5 * pulse, 5 * pulse, 1);
        });
    }

    dispose() {
        this.coins.forEach(coin => {
            this.scene.remove(coin.mesh);
            coin.mesh.material.map.dispose();
            coin.mesh.material.dispose();
        });
    }
}

export default BusinessScene;

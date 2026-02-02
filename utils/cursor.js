// Custom Cursor Module
// Smooth-following cursor with morphing states

class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.position = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        this.ease = 0.15;

        this.init();
    }

    init() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.target.x = e.clientX;
            this.target.y = e.clientY;
        });

        // Handle interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .pain-item, .data-point, .cta-btn');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
            });

            el.addEventListener('mousedown', () => {
                this.cursor.classList.add('click');
            });

            el.addEventListener('mouseup', () => {
                this.cursor.classList.remove('click');
            });
        });

        // Start animation loop
        this.animate();
    }

    animate() {
        // Smooth easing
        this.position.x += (this.target.x - this.position.x) * this.ease;
        this.position.y += (this.target.y - this.position.y) * this.ease;

        // Update cursor position
        this.cursor.style.transform = `translate(${this.position.x - 20}px, ${this.position.y - 20}px)`;

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor
const cursor = new CustomCursor();

export default CustomCursor;

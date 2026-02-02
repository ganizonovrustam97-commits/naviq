// Smooth Scroll Module
// Inertial scrolling with momentum and parallax

class SmoothScroll {
    constructor() {
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.ease = 0.08;
        this.isScrolling = false;

        this.init();
    }

    init() {
        // Track scroll input
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.targetScrollY += e.deltaY * 0.5;
            this.targetScrollY = Math.max(0, Math.min(this.targetScrollY, this.getMaxScroll()));
        }, { passive: false });

        // Touch support for mobile
        let touchStart = 0;
        window.addEventListener('touchstart', (e) => {
            touchStart = e.touches[0].clientY;
        });

        window.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const delta = touchStart - touchY;
            this.targetScrollY += delta * 0.5;
            this.targetScrollY = Math.max(0, Math.min(this.targetScrollY, this.getMaxScroll()));
            touchStart = touchY;
        });

        // Start animation loop
        this.animate();
    }

    getMaxScroll() {
        return document.body.scrollHeight - window.innerHeight;
    }

    animate() {
        // Smooth easing
        this.scrollY += (this.targetScrollY - this.scrollY) * this.ease;

        // Apply scroll position
        const contentWrapper = document.querySelector('.content-wrapper');
        if (contentWrapper) {
            contentWrapper.style.transform = `translateY(-${this.scrollY}px)`;
        }

        // Calculate scroll progress for each section
        this.updateSectionProgress();

        requestAnimationFrame(() => this.animate());
    }

    updateSectionProgress() {
        const sections = document.querySelectorAll('.section');
        const viewportHeight = window.innerHeight;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const offset = this.scrollY;
            const sectionTop = section.offsetTop - offset;
            const progress = (offset - section.offsetTop + viewportHeight / 2) / viewportHeight;

            // Dispatch custom event with scroll progress
            const event = new CustomEvent('sectionProgress', {
                detail: {
                    index,
                    progress: Math.max(0, Math.min(1, progress)),
                    scrollY: this.scrollY
                }
            });
            section.dispatchEvent(event);
        });
    }

    getScrollY() {
        return this.scrollY;
    }

    getProgress() {
        return this.scrollY / this.getMaxScroll();
    }
}

// Initialize smooth scroll
const smoothScroll = new SmoothScroll();

export default smoothScroll;

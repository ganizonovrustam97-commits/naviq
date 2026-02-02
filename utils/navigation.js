// Navigation Controller for Lusion-style menu
// Handles smooth scrolling and active state management

(function () {
    'use strict';

    class NavigationController {
        constructor() {
            this.navLinks = document.querySelectorAll('.nav-link');
            this.indicators = document.querySelectorAll('.indicator');
            this.sections = document.querySelectorAll('.section');
            this.mainNav = document.querySelector('.main-nav');
            this.lastScrollY = 0;

            this.init();
        }

        init() {
            console.log('NavigationController: Initializing...');

            // Smooth scroll on nav link click
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);

                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Indicator click handlers
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    const sectionIndex = indicator.getAttribute('data-section');
                    const targetSection = document.querySelector(`[data-section="${sectionIndex}"]`);

                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });

                // Add labels for tooltips
                const labels = ['Hero', 'Pain', 'Solution', 'Path', 'B2B', 'Market', 'Model', 'Compare', 'Roadmap', 'Team', 'CTA'];
                indicator.setAttribute('data-label', labels[index] || `Section ${index + 1}`);
            });

            // Update active states on scroll
            window.addEventListener('scroll', () => {
                this.updateActiveSection();
                this.handleNavVisibility();
            });

            // Initial state
            this.updateActiveSection();

            console.log('NavigationController: ✅ Initialized');
        }

        updateActiveSection() {
            let currentSection = 0;
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            this.sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = index;
                }
            });

            // Update nav links
            this.navLinks.forEach((link, index) => {
                if (index === currentSection) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Update indicators
            this.indicators.forEach((indicator, index) => {
                if (index === currentSection) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        handleNavVisibility() {
            const currentScrollY = window.scrollY;

            // Hide nav on scroll down, show on scroll up
            if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                this.mainNav.classList.add('hidden');
            } else {
                this.mainNav.classList.remove('hidden');
            }

            this.lastScrollY = currentScrollY;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new NavigationController();
        });
    } else {
        new NavigationController();
    }
})();

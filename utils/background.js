// Background Cards Animation
// Creates floating image cards (certificates, offers, business cards)

(function () {
    'use strict';

    class BackgroundCards {
        constructor() {
            this.container = document.getElementById('bg-cards');
            this.cards = [];

            // Реальные изображения карточек
            this.images = [
                { src: 'assets/card8.jpg', type: 'offer' },
                { src: 'assets/card9.jpg', type: 'certificate' },
                { src: 'assets/mascot-guy.jpg', type: 'business' }
            ];

            this.init();
        }

        init() {
            console.log('BackgroundCards: Starting initialization...');

            if (!this.container) {
                console.error('BackgroundCards: Container #bg-cards NOT FOUND!');
                return;
            }

            console.log('BackgroundCards: Container found, creating cards...');

            // Create 30 floating image cards in 5 rows
            const rows = 5;
            const cardsPerRow = 6;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cardsPerRow; col++) {
                    // Случайное изображение из набора
                    const randomImage = this.images[Math.floor(Math.random() * this.images.length)];

                    const card = document.createElement('div');
                    card.className = `floating-card ${randomImage.type}`;
                    card.setAttribute('data-row', row);

                    // Создаём img элемент
                    const img = document.createElement('img');
                    img.src = randomImage.src;
                    img.alt = randomImage.type;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '12px';

                    // Отладка загрузки изображения
                    img.onerror = () => {
                        console.error(`Failed to load image: ${randomImage.src}`);
                    };
                    img.onload = () => {
                        console.log(`Image loaded: ${randomImage.src}`);
                    };

                    card.appendChild(img);

                    // Vertical positioning by row
                    const topPosition = (row * 20) + (Math.random() * 10);
                    card.style.top = `${topPosition}%`;

                    // Horizontal offset for stagger effect
                    const leftOffset = (col * 20) - (Math.random() * 10);
                    card.style.left = `${leftOffset}%`;

                    // Random delay for each card
                    const maxDuration = row % 2 === 0 ? 30 : 35;
                    card.style.animationDelay = `-${Math.random() * maxDuration}s`;

                    this.container.appendChild(card);
                    this.cards.push(card);
                }
            }

            console.log(`BackgroundCards: ✅ Initialized ${this.cards.length} image cards`);
            console.log(`BackgroundCards: Container has ${this.container.children.length} children`);
        }
    }

    // Initialize background cards when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new BackgroundCards();
        });
    } else {
        new BackgroundCards();
    }
})();

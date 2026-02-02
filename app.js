
import HeroScene from './scenes/hero.js';
import ChaosScene from './scenes/chaos.js';
import GuidanceScene from './scenes/guidance.js';
import ScaleScene from './scenes/scale.js';
import BusinessScene from './scenes/business.js';
import RoadmapScene from './scenes/roadmap.js';
import TeamScene from './scenes/team.js';

class App {
    constructor() {
        this.canvas = document.getElementById('webgl-canvas');
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.currentScene = null;
        this.scenes = {};
        this.time = 0;

        this.init();
    }

    init() {
        // 1. Setup Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // 2. Setup Scene & Camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 50;

        // 3. Initialize Sub-Scenes
        this.scenes.hero = new HeroScene(this.scene);
        this.scenes.chaos = new ChaosScene(this.scene);
        this.scenes.guidance = new GuidanceScene(this.scene);
        this.scenes.scale = new ScaleScene(this.scene);
        this.scenes.business = new BusinessScene(this.scene);
        this.scenes.roadmap = new RoadmapScene(this.scene);
        this.scenes.team = new TeamScene(this.scene);

        // 4. Listeners
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('scroll', () => this.onScroll());

        // 5. Start Loop
        this.animate();
        
        console.log('App: ✅ Initialized');
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Notify all sections of their scroll progress
        document.querySelectorAll('.section').forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const viewStart = index * windowHeight;
            const progress = Math.max(0, Math.min(1, (scrollY - viewStart) / windowHeight));
            
            // Custom event for scenes to listen to
            const event = new CustomEvent('sectionProgress', { 
                detail: { progress, rect } 
            });
            section.dispatchEvent(event);
        });
    }

    animate() {
        this.time += 0.01;
        
        // Update all scenes
        Object.values(this.scenes).forEach(scene => {
            if (scene.update) scene.update(this.time);
        });

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
}

// Start App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

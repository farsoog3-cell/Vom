import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TerminalSystem } from './Terminal.js';
import { WorkshopSystem } from './Workshop.js';

class AlmazEngine {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.isPlaying = false;
        this.player = null;
        this.pSpeed = 5;
        this.keys = {};
        this.init();
    }

    init() {
        this.scene.background = new THREE.Color(0x050505);
        this.camera.position.set(400, 400, 400);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        this.scene.add(new THREE.GridHelper(1000, 40, 0x444444, 0x222222));
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // الربط العالمي الهام جداً
        window.engine = this;
        window.terminal = new TerminalSystem(this);
        window.workshop = new WorkshopSystem(this);

        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);

        this.animate();
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.controls.enabled = !this.isPlaying;
        alert(this.isPlaying ? "وضع اللعب: تحرك بالأسهم" : "وضع التحرير");
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.isPlaying && this.player) {
            if (this.keys['ArrowUp']) this.player.translateZ(this.pSpeed);
            if (this.keys['ArrowDown']) this.player.translateZ(-this.pSpeed);
            if (this.keys['ArrowLeft']) this.player.rotation.y += 0.05;
            if (this.keys['ArrowRight']) this.player.rotation.y -= 0.05;

            const camOffset = new THREE.Vector3(0, 120, -250).applyMatrix4(this.player.matrixWorld);
            this.camera.position.lerp(camOffset, 0.1);
            this.camera.lookAt(this.player.position);
        }
        this.renderer.render(this.scene, this.camera);
    }
}
new AlmazEngine();

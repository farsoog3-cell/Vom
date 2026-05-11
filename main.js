import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TerminalSystem } from './Terminal.js';
import { WorkshopSystem } from './Workshop.js';

class AlmazEngine {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 10000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.isPlaying = false;
        this.player = null;
        this.units = [];
        this.init();
    }

    init() {
        this.scene.background = new THREE.Color(0x050505);
        this.camera.position.set(300, 300, 300);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(100, 500, 100);
        this.scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

        const floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshStandardMaterial({ color: 0x111111 }));
        floor.rotation.x = -Math.PI/2;
        this.scene.add(floor);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        // ربط الأنظمة
        window.terminal = new TerminalSystem(this);
        window.workshop = new WorkshopSystem(this);
        window.engine = this;

        this.animate();
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.controls.enabled = !this.isPlaying;
        document.getElementById('mobileControls').style.display = this.isPlaying ? 'grid' : 'none';
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.isPlaying && this.player) {
            // منطق الحركة يوضع هنا
            const camPos = new THREE.Vector3(0, 120, -250).applyMatrix4(this.player.matrixWorld);
            this.camera.position.lerp(camPos, 0.1);
            this.camera.lookAt(this.player.position);
        }
        this.renderer.render(this.scene, this.camera);
    }
}

new AlmazEngine();
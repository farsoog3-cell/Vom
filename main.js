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
        this.pSpeed = 4;
        this.keys = {};
        this.init();
    }

    init() {
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.camera.position.set(400, 400, 400);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // إضاءة سينمائية
        const sun = new THREE.DirectionalLight(0xffffff, 1.5);
        sun.position.set(200, 600, 200);
        sun.castShadow = true;
        this.scene.add(sun, new THREE.AmbientLight(0xffffff, 0.4));

        // الأرضية والشبكة (مثل الصورة)
        const grid = new THREE.GridHelper(2000, 50, 0x444444, 0x222222);
        this.scene.add(grid);
        
        const floorGeo = new THREE.PlaneGeometry(2000, 2000);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        // ربط الأنظمة بالنطاق العام
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
        if(this.isPlaying) alert("وضع اللعب نشط: استخدم الأسهم للتحريك");
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.isPlaying && this.player) {
            if(this.keys['ArrowUp']) this.player.translateZ(this.pSpeed);
            if(this.keys['ArrowDown']) this.player.translateZ(-this.pSpeed);
            if(this.keys['ArrowLeft']) this.player.rotation.y += 0.05;
            if(this.keys['ArrowRight']) this.player.rotation.y -= 0.05;

            // كاميرا احترافية تتبع اللاعب
            const offset = new THREE.Vector3(0, 150, -300).applyMatrix4(this.player.matrixWorld);
            this.camera.position.lerp(offset, 0.1);
            this.camera.lookAt(this.player.position);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}
new AlmazEngine();

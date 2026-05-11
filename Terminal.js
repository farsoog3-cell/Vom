import * as THREE from 'three';

export class TerminalSystem {
    constructor(engine) {
        this.engine = engine;
        this.box = document.getElementById('terminal-box');
        this.input = document.getElementById('terminal-input');
        this.log = document.getElementById('t-log');
        this.setup();
    }

    setup() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.execute(this.input.value);
                this.input.value = '';
            }
        });
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 't') this.toggle();
        });
    }

    toggle() {
        const isVisible = this.box.style.display === 'block';
        this.box.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) this.input.focus();
    }

    addToLog(msg) {
        this.log.innerHTML = `<div>> ${msg}</div>`;
        this.log.scrollTop = this.log.scrollHeight;
    }

    execute(cmd) {
        const args = cmd.toLowerCase().trim().split(' ');
        const action = args[0];
        const val = args[1];

        switch(action) {
            // 1. الشمس والضوء والظلال
            case 'sun':
                const sunLight = new THREE.DirectionalLight(0xffffff, parseFloat(val) || 1.5);
                sunLight.position.set(200, 500, 200);
                sunLight.castShadow = true;
                sunLight.shadow.mapSize.width = 2048;
                sunLight.shadow.mapSize.height = 2048;
                this.engine.scene.add(sunLight);
                this.addToLog("تم إضافة شمس وظلال واقعية");
                break;

            // 2. الأرض
            case 'floor':
                const floorGeo = new THREE.PlaneGeometry(5000, 5000);
                const floorMat = new THREE.MeshStandardMaterial({ color: val || 0x222222 });
                const floor = new THREE.Mesh(floorGeo, floorMat);
                floor.rotation.x = -Math.PI / 2;
                floor.receiveShadow = true;
                this.engine.scene.add(floor);
                this.addToLog("تم توسيع الأرضية");
                break;

            // 3. شجر (Tree)
            case 'tree':
                const treeGroup = new THREE.Group();
                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 10), new THREE.MeshStandardMaterial({color: 0x4b2d1f}));
                const leaves = new THREE.Mesh(new THREE.ConeGeometry(8, 20), new THREE.MeshStandardMaterial({color: 0x2d5a27}));
                leaves.position.y = 12;
                treeGroup.add(trunk, leaves);
                treeGroup.position.set(Math.random()*200-100, 5, Math.random()*200-100);
                this.engine.scene.add(treeGroup);
                this.addToLog("تم زرع شجرة");
                break;

            // 4. بيت (House)
            case 'house':
                const house = new THREE.Group();
                const base = new THREE.Mesh(new THREE.BoxGeometry(30, 20, 30), new THREE.MeshStandardMaterial({color: 0xffffff}));
                const roof = new THREE.Mesh(new THREE.ConeGeometry(25, 15, 4), new THREE.MeshStandardMaterial({color: 0x8b0000}));
                roof.position.y = 17.5; roof.rotation.y = Math.PI/4;
                house.add(base, roof);
                house.position.y = 10;
                this.engine.scene.add(house);
                this.addToLog("تم بناء بيت");
                break;

            // 5. غيوم (Clouds)
            case 'cloud':
                const cloud = new THREE.Mesh(new THREE.SphereGeometry(10, 8, 8), new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true, opacity: 0.8}));
                cloud.scale.set(2, 0.5, 1);
                cloud.position.set(Math.random()*400-200, 150, Math.random()*400-200);
                this.engine.scene.add(cloud);
                this.addToLog("تم إضافة غيمة");
                break;

            // 6. سيارة (Car)
            case 'car':
                const car = new THREE.Group();
                const body = new THREE.Mesh(new THREE.BoxGeometry(20, 8, 10), new THREE.MeshStandardMaterial({color: val || 'red'}));
                const cabin = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 8), new THREE.MeshStandardMaterial({color: 'white'}));
                cabin.position.set(-2, 6, 0);
                car.add(body, cabin);
                car.position.y = 4;
                this.engine.scene.add(car);
                this.engine.player = car; // تحكم فوري بالسيارة
                this.addToLog("السيارة جاهزة للقيادة");
                break;

            // 7. تحكم الكاميرا
            case 'cam':
                if(val === 'free') this.engine.controls.enabled = true;
                if(val === 'follow') this.engine.controls.enabled = false;
                this.addToLog("تغيير نمط الكاميرا إلى: " + val);
                break;

            default:
                this.addToLog("أمر غير مدعوم حالياً");
        }
    }
}

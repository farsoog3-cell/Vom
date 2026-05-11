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

    logMsg(m) {
        this.log.innerHTML += `<div>> ${m}</div>`;
        this.log.scrollTop = this.log.scrollHeight;
    }

    execute(cmd) {
        const args = cmd.toLowerCase().trim().split(' ');
        const act = args[0];
        const val = args[1];

        switch(act) {
            case 'sun':
                const sun = new THREE.DirectionalLight(0xffffff, 2);
                sun.position.set(300, 600, 300);
                sun.castShadow = true;
                // تحسين جودة الظلال
                sun.shadow.mapSize.set(2048, 2048);
                sun.shadow.camera.left = -500;
                sun.shadow.camera.right = 500;
                sun.shadow.camera.top = 500;
                sun.shadow.camera.bottom = -500;
                this.engine.scene.add(sun);
                this.logMsg("تم تفعيل الشمس والظلال الواقعية");
                break;

            case 'floor':
                const fGeo = new THREE.PlaneGeometry(5000, 5000);
                const fMat = new THREE.MeshStandardMaterial({ color: val || 0x1a1a1a });
                const floor = new THREE.Mesh(fGeo, fMat);
                floor.rotation.x = -Math.PI / 2;
                floor.receiveShadow = true;
                this.engine.scene.add(floor);
                this.logMsg("تم إضافة أرضية عملاقة");
                break;

            case 'car':
                const car = new THREE.Group();
                const body = new THREE.Mesh(new THREE.BoxGeometry(30, 12, 15), new THREE.MeshStandardMaterial({color: val || 'red'}));
                const roof = new THREE.Mesh(new THREE.BoxGeometry(15, 10, 12), new THREE.MeshStandardMaterial({color: 'white'}));
                roof.position.set(-2, 10, 0);
                car.add(body, roof); car.position.y = 6;
                car.castShadow = true;
                this.engine.scene.add(car);
                this.engine.player = car;
                this.logMsg("تم استدعاء سيارة.. وضع اللعب مفعل");
                break;

            case 'tree':
                const tree = new THREE.Group();
                const tTrunk = new THREE.Mesh(new THREE.CylinderGeometry(3,3,20), new THREE.MeshStandardMaterial({color: 0x4b2d1f}));
                const tLeaf = new THREE.Mesh(new THREE.SphereGeometry(15), new THREE.MeshStandardMaterial({color: 0x2d5a27}));
                tLeaf.position.y = 15; tree.add(tTrunk, tLeaf);
                tree.position.set(Math.random()*600-300, 10, Math.random()*600-300);
                tree.castShadow = true;
                this.engine.scene.add(tree);
                this.logMsg("تم زرع شجرة في مكان عشوائي");
                break;

            case 'house':
                const h = new THREE.Group();
                const b = new THREE.Mesh(new THREE.BoxGeometry(40, 30, 40), new THREE.MeshStandardMaterial({color: 0xeeeeee}));
                const r = new THREE.Mesh(new THREE.ConeGeometry(35, 20, 4), new THREE.MeshStandardMaterial({color: 0x8b0000}));
                r.position.y = 25; r.rotation.y = Math.PI/4;
                h.add(b, r); h.position.set(Math.random()*400, 15, Math.random()*400);
                h.castShadow = true;
                this.engine.scene.add(h);
                this.logMsg("تم بناء منزل جديد");
                break;

            case 'cloud':
                const cloud = new THREE.Group();
                const cMat = new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true, opacity: 0.8});
                for(let i=0; i<3; i++) {
                    const p = new THREE.Mesh(new THREE.SphereGeometry(15), cMat);
                    p.position.x = i * 15;
                    p.scale.set(1.5, 0.8, 1);
                    cloud.add(p);
                }
                cloud.position.set(Math.random()*1000-500, 200, Math.random()*1000-500);
                this.engine.scene.add(cloud);
                this.logMsg("تم إضافة سحابة في السماء");
                break;

            case 'sky':
                this.engine.scene.background = new THREE.Color(val || 'lightblue');
                this.logMsg("تغيير لون الجو");
                break;

            case 'speed':
                this.engine.pSpeed = parseFloat(val) || 5;
                this.logMsg("السرعة الآن: " + this.engine.pSpeed);
                break;

            case 'clear':
                // مسح كل شيء ما عدا الإضاءة الأساسية
                this.engine.scene.children = this.engine.scene.children.filter(c => c instanceof THREE.Light);
                this.logMsg("تم تنظيف العالم");
                break;

            case 'help':
                this.logMsg("الأوامر: sun, floor, car, tree, house, cloud, sky, speed, clear");
                break;

            default:
                this.logMsg("أمر غير معروف! اكتب help");
        }
    }
}

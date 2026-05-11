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
            // --- أمر الأرض ---
            case 'floor':
                // إنشاء أرضية ضخمة (حجم 5000)
                const fGeo = new THREE.PlaneGeometry(5000, 5000);
                // مادة تستقبل الإضاءة والظلال
                const fMat = new THREE.MeshStandardMaterial({ 
                    color: val || 0x1a1a1a, // اللون الافتراضي رمادي غامق
                    side: THREE.DoubleSide 
                });
                const floor = new THREE.Mesh(fGeo, fMat);
                floor.rotation.x = -Math.PI / 2; // جعلها منبطحة
                floor.receiveShadow = true; // تفعيل استقبال الظلال
                this.engine.scene.add(floor);
                this.logMsg("تم إضافة الأرضية (تستقبل الظلال الآن)");
                break;

            // --- أمر الشمس ---
            case 'sun':
                const sun = new THREE.DirectionalLight(0xffffff, 2.5); // قوة الإضاءة 2.5
                sun.position.set(500, 1000, 500); // مكان الشمس في السماء
                sun.castShadow = true; // جعل الشمس تطلق ظلالاً
                
                // تحسين دقة الظلال
                sun.shadow.mapSize.width = 2048;
                sun.shadow.mapSize.height = 2048;
                sun.shadow.camera.left = -1000;
                sun.shadow.camera.right = 1000;
                sun.shadow.camera.top = 1000;
                sun.shadow.camera.bottom = -1000;
                
                this.engine.scene.add(sun);
                this.logMsg("تم تفعيل الشمس والظلال العالية الدقة");
                break;

            case 'help':
                this.logMsg("الأوامر المتاحة: floor [اللون], sun, car, tree, house, sky, clear");
                break;

            default:
                this.logMsg("أمر غير معروف! اكتب help");
        }
    }
}

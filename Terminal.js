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
        // فتح اللوحة بحرف T
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 't') this.toggle();
        });
    }

    toggle() {
        const isVisible = this.box.style.display === 'block';
        this.box.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) this.input.focus();
    }

    execute(cmd) {
        const args = cmd.toLowerCase().trim().split(' ');
        const action = args[0];

        if (action === 'spawn') {
            const geo = new THREE.BoxGeometry(20, 20, 20);
            const mat = new THREE.MeshStandardMaterial({ color: 0xf1c40f });
            const m = new THREE.Mesh(geo, mat);
            m.position.y = 10;
            this.engine.scene.add(m);
            this.engine.player = m;
            this.log.innerHTML = "تم إنشاء مكعب اللاعب";
        } else if (action === 'sky') {
            this.engine.scene.background = new THREE.Color(args[1] || 0x050505);
        } else if (action === 'speed') {
            this.engine.pSpeed = parseFloat(args[1]) || 4;
            this.log.innerHTML = "السرعة: " + this.engine.pSpeed;
        }
    }
}

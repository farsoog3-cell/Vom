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
        const show = this.box.style.display === 'none' || this.box.style.display === '';
        this.box.style.display = show ? 'block' : 'none';
        if(show) this.input.focus();
    }

    logMsg(m) { this.log.innerHTML += `<div>> ${m}</div>`; this.log.scrollTop = this.log.scrollHeight; }

    execute(cmd) {
        const args = cmd.toLowerCase().trim().split(' ');
        const act = args[0];

        if (act === 'sun') {
            const l = new THREE.DirectionalLight(0xffffff, 2);
            l.position.set(100, 500, 100); l.castShadow = true;
            this.engine.scene.add(l);
            this.logMsg("تم إضافة شمس وظلال");
        } 
        else if (act === 'car') {
            const car = new THREE.Group();
            const b = new THREE.Mesh(new THREE.BoxGeometry(25, 10, 12), new THREE.MeshStandardMaterial({color: 'red'}));
            const c = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 10), new THREE.MeshStandardMaterial({color: 'white'}));
            c.position.set(-2, 8, 0); car.add(b, c); car.position.y = 5;
            this.engine.scene.add(car); this.engine.player = car;
            this.logMsg("تم إضافة سيارة للقيادة");
        }
        else if (act === 'house') {
            const h = new THREE.Group();
            const base = new THREE.Mesh(new THREE.BoxGeometry(40, 30, 40), new THREE.MeshStandardMaterial({color: 0xcccccc}));
            const roof = new THREE.Mesh(new THREE.ConeGeometry(35, 20, 4), new THREE.MeshStandardMaterial({color: 0x8b0000}));
            roof.position.y = 25; roof.rotation.y = Math.PI/4;
            h.add(base, roof); h.position.set(Math.random()*200, 15, Math.random()*200);
            this.engine.scene.add(h);
            this.logMsg("تم بناء بيت");
        }
        else if (act === 'tree') {
            const t = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2,2,15), new THREE.MeshStandardMaterial({color: 0x4b2d1f}));
            const leaf = new THREE.Mesh(new THREE.SphereGeometry(10), new THREE.MeshStandardMaterial({color: 0x2d5a27}));
            leaf.position.y = 12; t.add(trunk, leaf);
            t.position.set(Math.random()*300-150, 7.5, Math.random()*300-150);
            this.engine.scene.add(t);
            this.logMsg("تم زرع شجرة");
        }
        else if (act === 'sky') {
            this.engine.scene.background = new THREE.Color(args[1] || 'lightblue');
        }
    }
}

import * as THREE from 'three';

export class TerminalSystem {
    constructor(engine) {
        this.engine = engine;
        this.container = document.getElementById('terminal-container');
        this.input = document.getElementById('terminal-input');
        this.log = document.getElementById('terminal-log');
        this.setup();
    }

    setup() {
        this.input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                this.execute(this.input.value);
                this.input.value = '';
            }
        };
        window.onkeydown = (e) => { if(e.key.toLowerCase() === 't') this.toggle(); };
    }

    toggle() {
        this.container.style.display = this.container.style.display === 'block' ? 'none' : 'block';
        if(this.container.style.display === 'block') this.input.focus();
    }

    execute(cmd) {
        const args = cmd.toLowerCase().split(' ');
        const action = args[0];
        
        if (action === 'sky') {
            this.engine.scene.background = new THREE.Color(args[1]);
        } else if (action === 'spawn') {
            const m = new THREE.Mesh(new THREE.BoxGeometry(20,20,20), new THREE.MeshStandardMaterial({color:'gold'}));
            m.position.y = 10;
            this.engine.scene.add(m);
            this.engine.player = m;
        } else if (action === 'man') {
            this.spawnMan();
        }
        
        this.log.innerHTML += `<div>> ${cmd}</div>`;
        this.log.scrollTop = this.log.scrollHeight;
    }

    spawnMan() {
        const group = new THREE.Group();
        // كود إنشاء الرجل (الرأس والجسم)
        const body = new THREE.Mesh(new THREE.BoxGeometry(10,15,5), new THREE.MeshStandardMaterial({color:'blue'}));
        body.position.y = 15;
        const head = new THREE.Mesh(new THREE.BoxGeometry(7,7,7), new THREE.MeshStandardMaterial({color:'pink'}));
        head.position.y = 27;
        group.add(body, head);
        this.engine.scene.add(group);
        this.engine.player = group;
    }
}
import * as THREE from 'three';

export class WorkshopSystem {
    constructor(engine) {
        this.engine = engine;
    }

    import(event) {
        const file = event.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if(this.engine.player) this.engine.scene.remove(this.engine.player);

                const group = new THREE.Group();
                const parts = Array.isArray(data) ? data : [data];
                
                parts.forEach(p => {
                    const mesh = new THREE.Mesh(
                        new THREE.BoxGeometry(p.size||20, p.size||20, p.size||20),
                        new THREE.MeshStandardMaterial({ color: p.color || 0x00ff00 })
                    );
                    if(p.pos) mesh.position.set(p.pos.x, p.pos.y, p.pos.z);
                    mesh.castShadow = true;
                    group.add(mesh);
                });

                this.engine.scene.add(group);
                this.engine.player = group;
                console.log("Object Loaded Successfully");
            } catch(err) { alert("خطأ في ملف الورشة!"); }
        };
        reader.readAsText(file);
    }

    exportGame() {
        if(!this.engine.player) return alert("اصنع لاعباً أولاً!");
        const color = this.engine.player.children[0]?.material.color.getHex() || 0x00ff00;
        
        const html = `<html><body style="margin:0; overflow:hidden">
            <script type="module">
                import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
                const s=new THREE.Scene(); const c=new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
                const r=new THREE.WebGLRenderer(); r.setSize(window.innerWidth, window.innerHeight); document.body.appendChild(r.domElement);
                const p=new THREE.Mesh(new THREE.BoxGeometry(20,20,20), new THREE.MeshBasicMaterial({color:${color}})); s.add(p);
                c.position.z = 100;
                function a(){ requestAnimationFrame(a); p.rotation.y+=0.01; r.render(s,c); } a();
            <\/script></body></html>`;

        const blob = new Blob([html], {type:'text/html'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'MyAlmazGame.html';
        link.click();
    }
}

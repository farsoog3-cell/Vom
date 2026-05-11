import * as THREE from 'three';

export class WorkshopSystem {
    constructor(engine) {
        this.engine = engine;
    }

    import(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            if (this.engine.player) this.engine.scene.remove(this.engine.player);
            
            const group = new THREE.Group();
            const parts = Array.isArray(data) ? data : [data];
            parts.forEach(p => {
                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(p.size || 20, p.size || 20, p.size || 20),
                    new THREE.MeshStandardMaterial({ color: p.color || 0x3498db })
                );
                if (p.pos) mesh.position.set(p.pos.x, p.pos.y, p.pos.z);
                group.add(mesh);
            });
            this.engine.scene.add(group);
            this.engine.player = group;
            alert("تم استيراد المجسم بنجاح!");
        };
        reader.readAsText(file);
    }

    exportGame() {
        if (!this.engine.player) return alert("لا يوجد مجسم للتصدير!");
        const color = "#" + this.engine.player.children[0].material.color.getHexString();
        
        const html = `<!DOCTYPE html><html><head><title>Almaz Game</title></head>
        <body style="margin:0; background:#000; overflow:hidden">
        <script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js"}}<\/script>
        <script type="module">
            import * as THREE from 'three';
            const s=new THREE.Scene(); const c=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1000);
            const r=new THREE.WebGLRenderer(); r.setSize(window.innerWidth,window.innerHeight); document.body.appendChild(r.domElement);
            const p=new THREE.Mesh(new THREE.BoxGeometry(20,20,20),new THREE.MeshStandardMaterial({color:'${color}'}));
            s.add(p, new THREE.AmbientLight(0xffffff,1)); p.position.y=10; c.position.set(0,50,100); c.lookAt(0,0,0);
            function a(){ requestAnimationFrame(a); p.rotation.y+=0.01; r.render(s,c); } a();
        <\/script></body></html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Almaz_Export.html';
        a.click();
    }
}

import * as THREE from 'three';

export class WorkshopSystem {
    constructor(engine) { this.engine = engine; }

    import(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
            const data = JSON.parse(ev.target.result);
            const group = new THREE.Group();
            data.forEach(p => {
                const m = new THREE.Mesh(new THREE.BoxGeometry(p.size||20,p.size||20,p.size||20), new THREE.MeshStandardMaterial({color:p.color}));
                if(p.pos) m.position.set(p.pos.x, p.pos.y, p.pos.z);
                group.add(m);
            });
            this.engine.scene.add(group); this.engine.player = group;
            alert("تم استيراد المجسم!");
        };
        reader.readAsText(file);
    }

    exportGame() {
        if(!this.engine.player) return alert("لا يوجد شيء لتصديره");
        const html = `<html><body style="margin:0; background:#000;">
        <script type="module">
            import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
            const s=new THREE.Scene(); const c=new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
            const r=new THREE.WebGLRenderer(); r.setSize(window.innerWidth, window.innerHeight); document.body.appendChild(r.domElement);
            const l=new THREE.DirectionalLight(0xffffff, 1); l.position.set(10,10,10); s.add(l, new THREE.AmbientLight(0xffffff, 0.5));
            const p=new THREE.Mesh(new THREE.BoxGeometry(20,20,20), new THREE.MeshStandardMaterial({color:'red'})); s.add(p);
            c.position.z=50; function a(){ requestAnimationFrame(a); p.rotation.y+=0.01; r.render(s,c); } a();
        <\/script></body></html>`;
        const blob = new Blob([html], {type:'text/html'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='Almaz_Game.html'; a.click();
    }
}

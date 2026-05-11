import * as THREE from 'three';

export class WorkshopSystem {
    constructor(engine) {
        this.engine = engine;
    }

    import(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            const group = new THREE.Group();
            data.forEach(p => {
                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(p.size || 10, p.size || 10, p.size || 10),
                    new THREE.MeshStandardMaterial({ color: p.color })
                );
                if(p.pos) mesh.position.set(p.pos.x, p.pos.y, p.pos.z);
                group.add(mesh);
            });
            this.engine.scene.add(group);
            this.engine.player = group;
            alert("تم استيراد مجسم الورشة!");
        };
        reader.readAsText(file);
    }
}
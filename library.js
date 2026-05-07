// مكتبة العناصر - هنا تضيف كل شيء جديد مستقبلاً
const AssetsLibrary = {
    shapes: [
        { name: "مكعب", type: "cube", icon: "📦" },
        { name: "كرة", type: "sphere", icon: "🔴" },
        { name: "أسطوانة", type: "cylinder", icon: "🧪" }
    ],
    nature: [
        { name: "شجرة بلوط", type: "tree_oak", icon: "🌳" },
        { name: "صنوبر", type: "tree_pine", icon: "🌲" },
        { name: "عشب", type: "grass", icon: "🌱" },
        { name: "صخرة", type: "rock", icon: "🪨" }
    ],
    assets: [
        { name: "بحر/مياه", type: "water_plane", icon: "🌊" },
        { name: "كاميرا مشهد", type: "scene_cam", icon: "📷" }
    ]
};

// وظيفة بناء المجسمات بناءً على النوع (تضيف كود الرسم هنا)
function createAssetMesh(type) {
    let geo, mat, mesh;
    mat = new THREE.MeshStandardMaterial({ color: 0xdeff9a });

    switch(type) {
        case 'cube': 
            geo = new THREE.BoxGeometry(2, 2, 2); 
            break;
        case 'sphere': 
            geo = new THREE.SphereGeometry(1.2, 32, 32); 
            break;
        case 'tree_oak':
            mesh = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), new THREE.MeshStandardMaterial({color: 0x5d4037}));
            const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.5), new THREE.MeshStandardMaterial({color: 0x2e7d32}));
            leaves.position.y = 1.5;
            mesh.add(trunk, leaves);
            break;
        case 'water_plane':
            geo = new THREE.PlaneGeometry(20, 20);
            mat = new THREE.MeshStandardMaterial({ color: 0x00aaff, transparent: true, opacity: 0.7 });
            break;
        // أضف حالات (Case) جديدة هنا لكل شجرة أو مجسم جديد
        default:
            geo = new THREE.BoxGeometry(1, 1, 1);
    }

    if (!mesh) mesh = new THREE.Mesh(geo, mat);
    return mesh;
}
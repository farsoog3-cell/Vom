let scene, camera, renderer, orbit, transform;
let sceneObjects = [];

// تشغيل المحرك
window.onload = () => {
    initEngine();
    animate();
};

function initEngine() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f0f);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(12, 10, 12);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('viewport').appendChild(renderer.domElement);

    // الشبكة والإضاءة الأساسية (كما طلبت)
    scene.add(new THREE.GridHelper(50, 50, 0x333333, 0x222222));
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    
    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(10, 20, 10);
    scene.add(sun);

    // إضافة مكعب البداية
    const startCube = createAssetMesh('cube');
    startCube.position.set(0, 1, 0);
    scene.add(startCube);
    sceneObjects.push(startCube);

    // التحكم
    orbit = new THREE.OrbitControls(camera, renderer.domElement);
    transform = new THREE.TransformControls(camera, renderer.domElement);
    scene.add(transform);
    transform.addEventListener('dragging-changed', e => orbit.enabled = !e.value);

    // نظام الاختيار باللمس
    window.addEventListener('mousedown', onPointerDown);
}

// وظيفة فتح المكتبة المنبثقة وتعبئتها من ملف library.js
function openLibrary(category) {
    const modal = document.getElementById('library-modal');
    const content = document.getElementById('library-content');
    content.innerHTML = "";
    
    AssetsLibrary[category].forEach(item => {
        const div = document.createElement('div');
        div.className = "asset-card";
        div.innerHTML = `<div>${item.icon}</div><div style="font-size:12px">${item.name}</div>`;
        div.onclick = () => {
            const mesh = createAssetMesh(item.type);
            mesh.position.set(Math.random()*4, 1, Math.random()*4);
            scene.add(mesh);
            sceneObjects.push(mesh);
            transform.attach(mesh);
            closeLibrary();
        };
        content.appendChild(div);
    });
    
    modal.style.display = 'block';
}

function closeLibrary() { document.getElementById('library-modal').style.display = 'none'; }

function onPointerDown(e) {
    if (e.target.tagName !== 'CANVAS') return;
    const mouse = new THREE.Vector2((e.clientX/window.innerWidth)*2-1, -(e.clientY/window.innerHeight)*2+1);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(sceneObjects, true);
    if (intersects.length > 0) {
        let t = intersects[0].object;
        while(t.parent && t.parent !== scene) t = t.parent;
        transform.attach(t);
    }
}

function setGizmoMode(m) {
    transform.setMode(m);
    document.querySelectorAll('.gizmo-tools .btn').forEach(b => b.classList.remove('active'));
    document.getElementById('m-'+m[0]).classList.add('active');
}

function deleteSelected() {
    if (transform.object) {
        scene.remove(transform.object);
        sceneObjects = sceneObjects.filter(o => o !== transform.object);
        transform.detach();
    }
}

function animate() {
    requestAnimationFrame(animate);
    orbit.update();
    renderer.render(scene, camera);
}
let scene, camera, renderer, orbit, transform, raycaster, mouse;
let objects = [], selectedObj = null;

init();

function init() {
    // 1. إعداد المشهد
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(20, 20, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('viewport').appendChild(renderer.domElement);

    // 2. الإضاءة
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(50, 50, 50);
    sun.castShadow = true;
    scene.add(sun);

    // 3. التحكم
    orbit = new THREE.OrbitControls(camera, renderer.domElement);
    transform = new THREE.TransformControls(camera, renderer.domElement);
    scene.add(transform);

    transform.addEventListener('dragging-changed', (e) => orbit.enabled = !e.value);

    // 4. الأرضية (افتراضية)
    const geo = new THREE.PlaneGeometry(100, 100);
    const mat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const ground = new THREE.Mesh(geo, mat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    animate();
}

// وظائف الواجهة
function toggleCat(id) {
    document.getElementById(id).classList.toggle('active');
}

function toggleViewMode(isView) {
    document.getElementById('editor-ui').style.display = isView ? 'none' : 'block';
    transform.detach();
    document.getElementById('btn-edit').classList.toggle('active', !isView);
    document.getElementById('btn-view').classList.toggle('active', isView);
}

function spawn(type, variant) {
    let obj;
    if (type === 'tree') {
        const group = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), new THREE.MeshStandardMaterial({color: 0x4d2600}));
        const leaves = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshStandardMaterial({color: 0x115511}));
        leaves.position.y = 1.5;
        group.add(trunk, leaves);
        obj = group;
    }
    // إضافة المجسم للمشهد
    obj.position.set(Math.random()*10-5, 1, Math.random()*10-5);
    scene.add(obj);
    objects.push(obj);
    transform.attach(obj);
}

function deleteObj() {
    if (transform.object) {
        scene.remove(transform.object);
        transform.detach();
    }
}

function animate() {
    requestAnimationFrame(animate);
    orbit.update();
    renderer.render(scene, camera);
}

// استجابة لتغيير حجم النافذة
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
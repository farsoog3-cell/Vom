let scene, camera, renderer, orbit, transform, sun;
let sceneObjects = [];
let editMode = 'object'; // 'object', 'vertex', 'sculpt'

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

    // 1. إظهار الشمس (مرئية ككرة مضيئة)
    const sunGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(10, 20, 10);
    scene.add(sunMesh);

    sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.copy(sunMesh.position);
    sun.castShadow = true;
    scene.add(sun);

    // 2. الشبكة
    scene.add(new THREE.GridHelper(50, 50, 0x444444, 0x222222));
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // 3. أدوات التحكم (Gizmo)
    orbit = new THREE.OrbitControls(camera, renderer.domElement);
    transform = new THREE.TransformControls(camera, renderer.domElement);
    scene.add(transform);

    // ربط الاختيار
    transform.addEventListener('dragging-changed', e => orbit.enabled = !e.value);

    // 4. إضافة مكعب البداية وتفعيله فوراً للتحكم
    setTimeout(() => {
        const startCube = createAssetMesh('cube');
        startCube.position.set(0, 1, 0);
        scene.add(startCube);
        sceneObjects.push(startCube);
        transform.attach(startCube); // تفعيل التحكم بالمكعب فوراً
    }, 100);

    window.addEventListener('mousedown', onPointerDown);
}

// تبديل أوضاع العمل (Blender Style)
function setWorkMode(mode) {
    editMode = mode;
    alert("تم الانتقال إلى وضع: " + mode);
    // هنا مستقبلاً يتم تفعيل "النحات" أو "تعديل النقاط"
}

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
    transform.setMode(m); // translate (تحريك), rotate (تدوير), scale (شد ومط)
    document.querySelectorAll('.gizmo-tools .btn').forEach(b => b.classList.remove('active'));
    document.getElementById('m-'+m[0]).classList.add('active');
}

function animate() {
    requestAnimationFrame(animate);
    orbit.update();
    renderer.render(scene, camera);
}

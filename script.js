let scene, camera, renderer, orbit, transform, sunLight, ground;
let objects = [], windObjects = [];
let windStrength = 0.03;

init();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0c);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(20, 15, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('viewport').appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(30, 50, 30);
    sunLight.castShadow = true;
    scene.add(sunLight);

    changeGround('green'); // إنشاء الأرضية فوراً

    orbit = new THREE.OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;

    transform = new THREE.TransformControls(camera, renderer.domElement);
    scene.add(transform);
    transform.addEventListener('dragging-changed', e => orbit.enabled = !e.value);

    // نظام النقر لاختيار والتنقل بين المجسمات
    window.addEventListener('mousedown', (e) => {
        if(e.target.tagName !== 'CANVAS') return;
        const mouse = new THREE.Vector2((e.clientX/window.innerWidth)*2-1, -(e.clientY/window.innerHeight)*2+1);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objects, true);
        if(intersects.length > 0) {
            let target = intersects[0].object;
            while(target.parent && target.parent !== scene) target = target.parent;
            transform.attach(target);
        }
    });

    animate();
}

function changeGround(type) {
    if(ground) scene.remove(ground);
    const geo = new THREE.PlaneGeometry(100, 100, 32, 32);
    let color = 0x1d2b1d;
    if(type === 'sand') color = 0xc2b280;
    if(type === 'mtn') color = 0x333333;
    
    const mat = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });
    if(type === 'mtn') {
        const pos = geo.attributes.position;
        for(let i=0; i<pos.count; i++) pos.setZ(i, Math.random() * 2);
    }
    ground = new THREE.Mesh(geo, mat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
}

function spawn(type) {
    let obj;
    if(type === 'tree') {
        obj = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.5), new THREE.MeshStandardMaterial({color: 0x4d2600}));
        const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.5), new THREE.MeshStandardMaterial({color: 0x1a5a1a}));
        leaves.position.y = 2;
        obj.add(trunk, leaves);
        windObjects.push(obj);
    } else if(type === 'grass') {
        obj = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.8, 3), new THREE.MeshStandardMaterial({color: 0x44ff44}));
        windObjects.push(obj);
    } else {
        obj = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshStandardMaterial({color: 0xdeff9a}));
    }
    obj.position.set(Math.random()*10-5, 0, Math.random()*10-5);
    obj.traverse(c => { if(c.isMesh) c.castShadow = true; });
    scene.add(obj);
    objects.push(obj);
    transform.attach(obj);
}

function setTMode(m) {
    transform.setMode(m);
    document.querySelectorAll('.top-left .btn').forEach(b => b.classList.remove('active'));
    document.getElementById('m-'+m[0]).classList.add('active');
}

function deleteObj() {
    if(transform.object) {
        const o = transform.object;
        scene.remove(o);
        objects = objects.filter(i => i !== o);
        windObjects = windObjects.filter(i => i !== o);
        transform.detach();
    }
}

function setView(isView) {
    document.querySelectorAll('.panel').forEach(p => p.style.display = isView ? 'none' : 'flex');
    if(isView) transform.detach();
}

function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.002;
    windObjects.forEach(o => o.rotation.z = Math.sin(time) * windStrength);
    orbit.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

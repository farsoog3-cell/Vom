import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, controls, sunLight, sunHelper;
let selectedObject = null;
let isPlaying = false;
const loader = new GLTFLoader();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    const container = document.getElementById('renderer-container');
    camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    // الأرضية والشبكة
    const grid = new THREE.GridHelper(20, 20, 0x555555, 0x444444);
    scene.add(grid);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // الشمس (الضوء) والتمثيل البصري لها
    sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(5, 10, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const sunGeo = new THREE.SphereGeometry(0.5, 16, 16);
    sunHelper = new THREE.Mesh(sunGeo, new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    scene.add(sunHelper);

    setupEvents();
    addCube(); // إضافة مكعب افتراضي
    animate();
}

// وظيفة الشد والمط (Scaling)
function setupEvents() {
    document.getElementById('scale-x').oninput = (e) => { if(selectedObject) selectedObject.scale.x = e.target.value; };
    document.getElementById('scale-y').oninput = (e) => { if(selectedObject) selectedObject.scale.y = e.target.value; };
    document.getElementById('scale-z').oninput = (e) => { if(selectedObject) selectedObject.scale.z = e.target.value; };

    // تحريك الشمس
    document.getElementById('sun-slider').oninput = (e) => {
        const angle = e.target.value * (Math.PI / 180);
        sunLight.position.x = Math.cos(angle) * 10;
        sunLight.position.z = Math.sin(angle) * 10;
        sunHelper.position.copy(sunLight.position);
    };

    // استيراد ملفات
    document.getElementById('file-input').onchange = (e) => {
        const url = URL.createObjectURL(e.target.files[0]);
        loader.load(url, (gltf) => {
            const model = gltf.scene;
            model.traverse(n => { if(n.isMesh) n.castShadow = true; });
            scene.add(model);
            selectedObject = model;
        });
    };
}

// تغيير وضع العرض (هاتف/كمبيوتر)
window.setViewport = (type) => {
    const canvasContainer = renderer.domElement;
    if (type === 'mobile') {
        canvasContainer.classList.add('mobile-view');
    } else {
        canvasContainer.classList.remove('mobile-view');
    }
    setTimeout(onResize, 350); // انتظار حركة الـ CSS ثم تحديث الحجم
};

function onResize() {
    const container = document.getElementById('renderer-container');
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
}

window.addCube = () => {
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x4caf50 }));
    cube.position.y = 0.5;
    cube.castShadow = true;
    scene.add(cube);
    selectedObject = cube;
};

window.addSphere = () => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0x2196f3 }));
    sphere.position.y = 0.5;
    sphere.castShadow = true;
    scene.add(sphere);
    selectedObject = sphere;
};

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', onResize);
init();

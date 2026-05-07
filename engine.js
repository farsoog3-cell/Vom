import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. الإعدادات الأساسية (المشهد، الكاميرا، المحرك)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // تفعيل الظلال
document.body.appendChild(renderer.domElement);

// 2. الشبكة والأرضية
const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
const floor = new THREE.Mesh(planeGeometry, planeMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// 3. الإضاءة (الشمس)
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(5, 10, 7.5);
sunLight.castShadow = true;
// تحسين جودة الظل
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x404040, 2); 
scene.add(ambientLight);

// 4. إضافة مكعب افتراضي مع ميزة "المط"
let selectedObject = null;

function createBox(x, y, z) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    selectedObject = cube;
    return cube;
}

createBox(0, 0.5, 0);

// 5. أدوات التحكم
const controls = new OrbitControls(camera, renderer.domElement);

// 6. نظام التحكم بلوحة المفاتيح (حركة وتمطيط)
window.addEventListener('keydown', (e) => {
    if (!selectedObject) return;

    const speed = 0.1;
    switch(e.key.toLowerCase()) {
        // تحريك
        case 'w': selectedObject.position.z -= speed; break;
        case 's': selectedObject.position.z += speed; break;
        case 'a': selectedObject.position.x -= speed; break;
        case 'd': selectedObject.position.x += speed; break;
        // مط وشط (Scaling)
        case 'r': selectedObject.scale.y += 0.1; break; // مط طولي
        case 'f': selectedObject.scale.y -= 0.1; break; // انكماش
        case 't': selectedObject.scale.x += 0.1; break; // عرضي
        case 'g': selectedObject.scale.x -= 0.1; break;
    }
});

// وظائف لإضافة أشكال من الواجهة
window.addCube = () => createBox(Math.random()*5, 0.5, Math.random()*5);
window.addSphere = () => {
    const geo = new THREE.SphereGeometry(0.5, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(Math.random()*5, 0.5, Math.random()*5);
    sphere.castShadow = true;
    scene.add(sphere);
    selectedObject = sphere;
};

// 7. حلقة التحديث (Game Loop)
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// التعامل مع تغيير حجم النافذة
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
import * as THREE from 'three';
import { scene } from './graphics.js';

export function createEnvironment() {
    // الإضاءة
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(100, 200, 100);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // الأرض
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000), 
        new THREE.MeshStandardMaterial({ color: 0x27ae60 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    return { ground, sunLight };
}

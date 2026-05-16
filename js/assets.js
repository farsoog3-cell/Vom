// js/assets.js
import * as THREE from 'three';

// تخزين الـ Geometries المشتركة لتوفر الذاكرة
export const geometries = {
    dozer: new THREE.BoxGeometry(2.6, 1.5, 3.6),
    factory: new THREE.BoxGeometry(11, 4.5, 8.5),
    oil: new THREE.CylinderGeometry(2.5, 3.5, 7, 16),
    ghost: new THREE.BoxGeometry(10, 0.2, 10)
};

// دالة إنشاء الجرافة
export function createDozerMesh() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(geometries.dozer, new THREE.MeshStandardMaterial({ color: 0xcc7a00 }));
    body.position.y = 0.75; body.castShadow = true; group.add(body);
    
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 1.8), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    cabin.position.set(0, 2.0, -0.4); group.add(cabin);
    
    group.userData = { type: 'dozer', targetX: 0, targetZ: 0, isBuilding: false, currentProject: null, radius: 2.2 };
    return group;
}

// دالة إنشاء الدبابة
export function createTankMesh() {
    const tGroup = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 3.6), new THREE.MeshStandardMaterial({ color: 0x1f4024 })); 
    base.position.y = 0.45; base.castShadow = true; tGroup.add(base);
    
    const turret = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 1.5), new THREE.MeshStandardMaterial({ color: 0x0a140d })); 
    turret.position.set(0, 1.15, -0.2); tGroup.add(turret);
    
    const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2), new THREE.MeshStandardMaterial({ color: 0x556655 })); 
    cannon.rotation.x = Math.PI / 2; cannon.position.set(0, 1.15, 1.2); tGroup.add(cannon);
    
    tGroup.userData = { type: 'tank', targetX: 0, targetZ: 0, radius: 2.0 };
    return tGroup;
}
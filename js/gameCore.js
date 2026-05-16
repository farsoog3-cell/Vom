// js/gameCore.js

export const gameState = {
    money: 3000,
    gameSpeedModifier: 1.0,
    graphicQualityHigh: true,
    selectedObject: null,
    buildMode: null,
    tacticalActionMode: null,
    
    // المصفوفات الأمنية للوحدات
    dozers: [],
    structures: [],
    units: [],
    smokeParticles: [],
    floatingTexts: []
};

// دالة تحديث واجهة الأموال
export function updateMoneyUI() {
    document.getElementById('money-txt').innerText = gameState.money;
}

// دالة التحقق من الاصطدام بالمباني
export function checkCollisions(unitObj) {
    gameState.structures.forEach(struct => {
        if(struct.userData.progress >= 100 && !struct.userData.isDemolishing) {
            const dx = unitObj.position.x - struct.position.x; 
            const dz = unitObj.position.z - struct.position.z;
            const dist = Math.sqrt(dx*dx + dz*dz); 
            const minDist = unitObj.userData.radius + struct.userData.radius;
            
            if(dist < minDist) {
                const overlap = minDist - dist; 
                unitObj.position.x += (dx / dist) * overlap; 
                unitObj.position.z += (dz / dist) * overlap;
                unitObj.userData.targetX = unitObj.position.x; 
                unitObj.userData.targetZ = unitObj.position.z;
            }
        }
    });
}
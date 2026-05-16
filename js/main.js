import { scene, camera, renderer } from './graphics.js';
import { createEnvironment } from './environment.js';
import { updatePhysics } from './physics.js';
import { updateMechanics } from './mechanics.js';
import { initUI } from './ui.js';
import { sounds } from './audio.js';

// تشغيل الأصوات المحيطية للعالم فور بدء اللعب
sounds.ambient.loop = true;
sounds.ambient.play();

// بناء العالم
const { ground } = createEnvironment();

// تهيئة واجهة المستخدم والفيزياء
initUI();

// حلقة اللعبة اللانهائية
function animate() {
    requestAnimationFrame(animate);
    
    updatePhysics(camera);
    updateMechanics(camera, ground);
    
    renderer.render(scene, camera);
}

animate();

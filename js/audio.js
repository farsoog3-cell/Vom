// يمكنك استخدام نظام الـ Audio الخاص بـ Three.js أو الـ HTML5 Audio العادي
export const sounds = {
    build: new Audio('sounds/build.mp3'),
    dig: new Audio('sounds/dig.mp3'),
    footstep: new Audio('sounds/footstep.mp3'),
    ambient: new Audio('sounds/wind.mp3')
};

export function playSound(name) {
    if(sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play().catch(e => console.log("الصوت يحتاج تفاعل مع الشاشة أولاً"));
    }
}

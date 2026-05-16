// js/audio.js

class AudioManager {
    constructor() {
        this.bgMusic = null;
        this.musicVolume = 0.75;
        this.sfxVolume = 0.90;
        this.sounds = {};
    }

    // تشغيل الموسيقى الخلفية
    playMusic(url) {
        if (this.bgMusic) this.bgMusic.pause();
        this.bgMusic = new Audio(url);
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.musicVolume;
        this.bgMusic.play().catch(e => console.log("تحتاج للتفاعل مع الشاشة أولاً لتشغيل الصوت."));
    }

    setMusicVolume(volume) {
        this.musicVolume = volume / 100;
        if (this.bgMusic) this.bgMusic.volume = this.musicVolume;
    }

    setSfxVolume(volume) {
        this.sfxVolume = volume / 100;
    }

    // تشغيل مؤثر صوتی سريع (أمر حركة، بناء، انفجار)
    playSFX(name, url) {
        const sound = new Audio(url);
        sound.volume = this.sfxVolume;
        sound.play();
    }
}

export const audioManager = new AudioManager();
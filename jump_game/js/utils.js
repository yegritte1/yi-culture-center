// 工具函数

/**
 * 检测两个矩形是否碰撞
 * @param {Object} rect1 - 第一个矩形 {x, y, width, height}
 * @param {Object} rect2 - 第二个矩形 {x, y, width, height}
 * @returns {boolean} 是否碰撞
 */
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

/**
 * 生成随机数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机数
 */
function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * 生成随机整数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机整数
 */
function randomInt(min, max) {
    return Math.floor(random(min, max));
}

/**
 * 从数组中随机选择一个元素
 * @param {Array} arr - 数组
 * @returns {*} 随机元素
 */
function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 线性插值
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {number} t - 插值因子 (0-1)
 * @returns {number} 插值结果
 */
function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * 限制数值在范围内
 * @param {number} value - 数值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的数值
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * 加载图片
 * @param {string} src - 图片路径
 * @returns {Promise<HTMLImageElement>} 图片元素
 */
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * 本地存储封装
 */
const Storage = {
    /**
     * 保存数据
     * @param {string} key - 键
     * @param {*} value - 值
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    },

    /**
     * 读取数据
     * @param {string} key - 键
     * @param {*} defaultValue - 默认值
     * @returns {*} 值
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }
};

/**
 * 音效管理器
 */
class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.5;
    }

    /**
     * 加载音效
     * @param {string} name - 音效名称
     * @param {string} src - 音效路径
     */
    load(name, src) {
        const audio = new Audio(src);
        audio.volume = this.volume;
        this.sounds[name] = audio;
    }

    /**
     * 播放音效
     * @param {string} name - 音效名称
     */
    play(name) {
        if (!this.enabled || !this.sounds[name]) return;
        
        const sound = this.sounds[name].cloneNode();
        sound.volume = this.volume;
        sound.play().catch(() => {});
    }

    /**
     * 设置音量
     * @param {number} vol - 音量 (0-1)
     */
    setVolume(vol) {
        this.volume = clamp(vol, 0, 1);
    }

    /**
     * 开关音效
     * @param {boolean} enabled - 是否启用
     */
    toggle(enabled) {
        this.enabled = enabled;
    }
}

/**
 * 动画缓动函数
 */
const Easing = {
    linear: t => t,
    easeIn: t => t * t,
    easeOut: t => 1 - (1 - t) * (1 - t),
    easeInOut: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    bounce: t => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkCollision, random, randomInt, randomChoice, lerp, clamp, loadImage, Storage, SoundManager, Easing };
}

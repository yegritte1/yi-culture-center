/**
 * 背景管理器
 * 绘制彝族山寨风景背景
 */
class Background {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 地面Y坐标
        this.groundY = canvas.height - 100;
        
        // 彝族传统色彩（先定义颜色）- 调亮版本
        this.colors = {
            skyTop: '#2d3561',      // 明亮藏蓝
            skyBottom: '#6b5a4a',   // 浅大地棕
            mountain: '#4a4030',    // 浅褐色山峦
            village: '#2d2820',     // 浅山寨剪影色
            ground: '#7a6a52',      // 浅土黄色地面
            grass: '#4a7a4a'        // 明亮绿色草
        };
        
        // 昼夜系统
        this.timeOfDay = 0; // 0-1, 0=正午, 0.5=黄昏, 1=午夜
        this.dayDuration = 3000; // 一周期持续多少帧（约50秒）
        this.timeSpeed = 0.0003; // 时间流逝速度
        
        // 视差滚动层
        this.layers = [
            { speed: 0.2, elements: [], type: 'sky' },
            { speed: 0.4, elements: [], type: 'mountains' },
            { speed: 0.6, elements: [], type: 'hills' },
            { speed: 1.0, elements: [], type: 'ground' }
        ];
        
        // 云朵
        this.clouds = [];
        this.initClouds();
        
        // 远山
        this.farMountains = [];
        this.initFarMountains();
        
        // 彝族山寨剪影
        this.villages = [];
        this.initVillages();
        
        // 地面装饰（索玛花丛）
        this.flowers = [];
        this.initFlowers();
    }
    
    /**
     * 初始化云朵
     */
    initClouds() {
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: randomInt(0, this.canvas.width),
                y: randomInt(20, 100),
                width: randomInt(60, 120),
                speed: random(0.2, 0.5)
            });
        }
    }
    
    /**
     * 初始化远山
     */
    initFarMountains() {
        let x = 0;
        while (x < this.canvas.width + 200) {
            const width = randomInt(150, 300);
            const height = randomInt(100, 200);
            this.farMountains.push({
                x: x,
                y: this.groundY - height,
                width: width,
                height: height,
                color: this.getMountainColor()
            });
            x += width - 20;
        }
    }
    
    /**
     * 获取山峰颜色
     */
    getMountainColor() {
        return this.colors.mountain;
    }
    
    /**
     * 初始化彝族山寨剪影
     */
    initVillages() {
        let x = 0;
        while (x < this.canvas.width + 400) {
            this.villages.push({
                x: x,
                width: randomInt(200, 400),
                houses: this.generateHouses()
            });
            x += randomInt(300, 600);
        }
    }
    
    /**
     * 生成山寨房屋
     */
    generateHouses() {
        const houses = [];
        let houseX = 0;
        const villageWidth = 400;
        
        while (houseX < villageWidth) {
            const width = randomInt(30, 60);
            const height = randomInt(40, 80);
            houses.push({
                x: houseX,
                width: width,
                height: height,
                hasTower: Math.random() > 0.7 // 30%概率有碉楼
            });
            houseX += width + randomInt(5, 15);
        }
        
        return houses;
    }
    
    /**
     * 初始化地面装饰花
     */
    initFlowers() {
        for (let i = 0; i < 10; i++) {
            this.flowers.push({
                x: randomInt(0, this.canvas.width),
                y: this.groundY + randomInt(-5, 5),
                color: randomChoice(['#ff6b9d', '#e91e63', '#f8bbd9']),
                size: random(0.5, 1)
            });
        }
    }
    
    /**
     * 更新背景
     */
    update(gameSpeed) {
        // 更新昼夜时间
        this.timeOfDay += this.timeSpeed;
        if (this.timeOfDay > 1) this.timeOfDay = 0;
        
        // 更新云朵
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed + gameSpeed * 0.1;
            if (cloud.x + cloud.width < 0) {
                cloud.x = this.canvas.width + randomInt(50, 200);
                cloud.y = randomInt(20, 100);
            }
        });
        
        // 更新远山
        this.farMountains.forEach(mountain => {
            mountain.x -= gameSpeed * 0.2;
        });
        
        // 循环远山
        if (this.farMountains.length > 0 && 
            this.farMountains[this.farMountains.length - 1].x < this.canvas.width) {
            const lastMountain = this.farMountains[this.farMountains.length - 1];
            const width = randomInt(150, 300);
            const height = randomInt(100, 200);
            this.farMountains.push({
                x: lastMountain.x + lastMountain.width - 20,
                y: this.groundY - height,
                width: width,
                height: height,
                color: this.getMountainColor()
            });
        }
        
        // 移除屏幕外的山
        this.farMountains = this.farMountains.filter(m => m.x + m.width > -100);
        
        // 更新山寨
        this.villages.forEach(village => {
            village.x -= gameSpeed * 0.3;
        });
        
        // 循环山寨
        if (this.villages.length > 0) {
            const lastVillage = this.villages[this.villages.length - 1];
            if (lastVillage.x < this.canvas.width) {
                this.villages.push({
                    x: lastVillage.x + lastVillage.width + randomInt(200, 400),
                    width: randomInt(200, 400),
                    houses: this.generateHouses()
                });
            }
        }
        
        // 移除屏幕外的山寨
        this.villages = this.villages.filter(v => v.x + v.width > -200);
        
        // 更新地面装饰花
        this.flowers.forEach(flower => {
            flower.x -= gameSpeed;
        });
        
        // 循环花朵
        this.flowers.forEach(flower => {
            if (flower.x < -20) {
                flower.x = this.canvas.width + randomInt(20, 100);
            }
        });
    }
    
    /**
     * 绘制背景
     */
    draw() {
        this.drawSky();
        this.drawClouds();
        this.drawFarMountains();
        this.drawGround();
        this.drawDecorations();
    }
    
    /**
     * 绘制天空 - 彝族传统色彩 + 昼夜效果
     */
    drawSky() {
        const ctx = this.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        
        // 根据时间计算颜色
        const colors = this.getSkyColors();
        
        gradient.addColorStop(0, colors.top);
        gradient.addColorStop(0.6, colors.middle);
        gradient.addColorStop(1, colors.bottom);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制星星（夜晚时）
        if (this.timeOfDay > 0.6 || this.timeOfDay < 0.1) {
            this.drawStars();
        }
        
        // 绘制太阳或月亮
        this.drawCelestialBody();
        
        // 添加淡淡的彝族纹样装饰（顶部）
        this.drawSkyPattern();
    }
    
    /**
     * 获取当前时间的天空颜色
     */
    getSkyColors() {
        const t = this.timeOfDay;
        
        // 定义不同时间的颜色
        const times = [
            { t: 0.0, top: '#4a90d9', middle: '#87ceeb', bottom: '#f0e68c' },    // 正午
            { t: 0.25, top: '#2d3561', middle: '#4a5568', bottom: '#f6ad55' },   // 下午
            { t: 0.5, top: '#1a1a3e', middle: '#4a3020', bottom: '#ff6b35' },    // 黄昏
            { t: 0.75, top: '#0a0a1a', middle: '#1a1a2e', bottom: '#2d2420' },  // 深夜
            { t: 1.0, top: '#4a90d9', middle: '#87ceeb', bottom: '#f0e68c' }     // 正午（循环）
        ];
        
        // 找到当前时间所在的区间
        let start = times[0];
        let end = times[times.length - 1];
        
        for (let i = 0; i < times.length - 1; i++) {
            if (t >= times[i].t && t <= times[i + 1].t) {
                start = times[i];
                end = times[i + 1];
                break;
            }
        }
        
        // 计算插值
        const ratio = (t - start.t) / (end.t - start.t);
        
        return {
            top: this.interpolateColor(start.top, end.top, ratio),
            middle: this.interpolateColor(start.middle, end.middle, ratio),
            bottom: this.interpolateColor(start.bottom, end.bottom, ratio)
        };
    }
    
    /**
     * 颜色插值
     */
    interpolateColor(color1, color2, ratio) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        
        const r = Math.round(r1 + (r2 - r1) * ratio);
        const g = Math.round(g1 + (g2 - g1) * ratio);
        const b = Math.round(b1 + (b2 - b1) * ratio);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    /**
     * 绘制星星
     */
    drawStars() {
        const ctx = this.ctx;
        const starOpacity = this.timeOfDay > 0.5 ? 
            Math.min((this.timeOfDay - 0.5) * 2, 1) : 
            Math.max(1 - this.timeOfDay * 10, 0);
        
        ctx.save();
        ctx.globalAlpha = starOpacity;
        ctx.fillStyle = '#ffffff';
        
        // 随机生成星星位置（基于时间种子）
        const seed = Math.floor(this.timeOfDay * 100);
        for (let i = 0; i < 50; i++) {
            const x = (i * 73 + seed * 37) % this.canvas.width;
            const y = (i * 37 + seed * 73) % (this.canvas.height * 0.6);
            const size = (i % 3) + 1;
            const twinkle = Math.sin(Date.now() * 0.003 + i) * 0.3 + 0.7;
            
            ctx.globalAlpha = starOpacity * twinkle;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    /**
     * 绘制太阳/月亮
     */
    drawCelestialBody() {
        const ctx = this.ctx;
        const t = this.timeOfDay;
        
        // 计算天体位置（弧形轨迹）
        const x = t * this.canvas.width;
        const y = this.canvas.height * 0.3 - Math.sin(t * Math.PI) * this.canvas.height * 0.2;
        
        if (t < 0.5) {
            // 绘制太阳
            ctx.save();
            
            // 太阳光晕
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
            gradient.addColorStop(0, 'rgba(255, 220, 100, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 180, 50, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, 40, 0, Math.PI * 2);
            ctx.fill();
            
            // 太阳本体
            ctx.fillStyle = '#ffdd44';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        } else {
            // 绘制月亮
            ctx.save();
            
            // 月亮光晕
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
            gradient.addColorStop(0, 'rgba(220, 220, 255, 0.6)');
            gradient.addColorStop(0.5, 'rgba(200, 200, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.fill();
            
            // 月亮本体
            ctx.fillStyle = '#f0f0f0';
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // 月球阴影
            ctx.fillStyle = '#d0d0d0';
            ctx.beginPath();
            ctx.arc(x + 5, y - 3, 12, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    /**
     * 绘制天空纹样（淡淡的装饰）
     */
    drawSkyPattern() {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = 0.03;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;
        
        const patternSize = 40;
        for (let x = 0; x < this.canvas.width; x += patternSize) {
            // 简单的几何纹样
            ctx.beginPath();
            ctx.moveTo(x, 20);
            ctx.lineTo(x + patternSize / 2, 5);
            ctx.lineTo(x + patternSize, 20);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    /**
     * 绘制云朵
     */
    drawClouds() {
        const ctx = this.ctx;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        this.clouds.forEach(cloud => {
            // 绘制云朵（多个圆组合）
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.width * 0.25, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.width * 0.25, cloud.y - 10, cloud.width * 0.3, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.width * 0.5, cloud.y, cloud.width * 0.25, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.width * 0.35, cloud.y + 5, cloud.width * 0.2, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    /**
     * 绘制远山和山寨
     */
    drawFarMountains() {
        const ctx = this.ctx;
        
        this.farMountains.forEach(mountain => {
            ctx.fillStyle = mountain.color;
            ctx.beginPath();
            ctx.moveTo(mountain.x, this.groundY);
            ctx.lineTo(mountain.x + mountain.width / 2, mountain.y);
            ctx.lineTo(mountain.x + mountain.width, this.groundY);
            ctx.closePath();
            ctx.fill();
        });
        
        // 绘制山寨剪影（在山峦前面）
        this.drawVillages();
    }
    
    /**
     * 绘制彝族山寨剪影
     */
    drawVillages() {
        const ctx = this.ctx;
        
        this.villages.forEach(village => {
            ctx.fillStyle = this.colors.village;
            
            village.houses.forEach(house => {
                const x = village.x + house.x;
                const y = this.groundY - house.height;
                
                // 房屋主体（吊脚楼风格）
                ctx.fillRect(x, y, house.width, house.height);
                
                // 屋顶（三角形）
                ctx.beginPath();
                ctx.moveTo(x - 5, y);
                ctx.lineTo(x + house.width / 2, y - 15);
                ctx.lineTo(x + house.width + 5, y);
                ctx.closePath();
                ctx.fill();
                
                // 如果有碉楼，绘制塔楼
                if (house.hasTower) {
                    const towerHeight = house.height + 30;
                    const towerY = this.groundY - towerHeight;
                    const towerWidth = house.width * 0.6;
                    const towerX = x + (house.width - towerWidth) / 2;
                    
                    // 碉楼主体
                    ctx.fillRect(towerX, towerY, towerWidth, towerHeight);
                    
                    // 碉楼顶部
                    ctx.beginPath();
                    ctx.moveTo(towerX - 3, towerY);
                    ctx.lineTo(towerX + towerWidth / 2, towerY - 10);
                    ctx.lineTo(towerX + towerWidth + 3, towerY);
                    ctx.closePath();
                    ctx.fill();
                    
                    // 窗户
                    ctx.fillStyle = 'rgba(60, 40, 20, 0.8)';
                    ctx.fillRect(towerX + towerWidth * 0.25, towerY + 15, towerWidth * 0.5, 8);
                    ctx.fillRect(towerX + towerWidth * 0.25, towerY + 35, towerWidth * 0.5, 8);
                    ctx.fillStyle = this.colors.village;
                }
            });
        });
    }
    
    /**
     * 绘制地面 - 彝族风格
     */
    drawGround() {
        const ctx = this.ctx;
        
        // 地面主体 - 土黄色
        ctx.fillStyle = this.colors.ground;
        ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
        
        // 地面顶部草皮 - 深绿色
        ctx.fillStyle = this.colors.grass;
        ctx.fillRect(0, this.groundY, this.canvas.width, 6);
        
        // 柔和的地面纹理
        ctx.strokeStyle = 'rgba(60, 50, 35, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, this.groundY + 8);
            ctx.lineTo(i + 20, this.groundY + 30);
            ctx.stroke();
        }
        
        // 绘制彝族纹样边框（柔和版）
        this.drawYiPatternBorder();
    }
    
    /**
     * 绘制彝族纹样边框（柔和不抢眼）
     */
    drawYiPatternBorder() {
        const ctx = this.ctx;
        const patternSize = 30;
        
        ctx.save();
        
        // 使用柔和的颜色
        const colors = [
            'rgba(220, 20, 60, 0.15)',   // 暗红色
            'rgba(255, 215, 0, 0.1)',    // 金色
            'rgba(30, 144, 255, 0.1)'    // 蓝色
        ];
        
        for (let x = 0; x < this.canvas.width; x += patternSize) {
            const colorIndex = Math.floor(x / patternSize) % colors.length;
            ctx.fillStyle = colors[colorIndex];
            
            // 简化的菱形图案
            ctx.beginPath();
            ctx.moveTo(x + patternSize / 2, this.groundY + 12);
            ctx.lineTo(x + patternSize - 3, this.groundY + 22);
            ctx.lineTo(x + patternSize / 2, this.groundY + 32);
            ctx.lineTo(x + 3, this.groundY + 22);
            ctx.closePath();
            ctx.fill();
            
            // 中心小点
            ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
            ctx.beginPath();
            ctx.arc(x + patternSize / 2, this.groundY + 22, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = colors[colorIndex];
        }
        
        ctx.restore();
    }
    
    /**
     * 绘制装饰元素
     */
    drawDecorations() {
        const ctx = this.ctx;
        
        // 绘制地面小花（索玛花）
        this.flowers.forEach(flower => {
            ctx.save();
            ctx.translate(flower.x, flower.y);
            ctx.scale(flower.size, flower.size);
            
            // 花瓣 - 索玛花颜色
            ctx.fillStyle = flower.color;
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 / 5) * i;
                const px = Math.cos(angle) * 4;
                const py = Math.sin(angle) * 4;
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 花心
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(0, 0, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
    }
    
    /**
     * 重置背景
     */
    reset() {
        this.clouds = [];
        this.farMountains = [];
        this.villages = [];
        this.flowers = [];
        this.initClouds();
        this.initFarMountains();
        this.initVillages();
        this.initFlowers();
    }
    
    /**
     * 调整大小
     */
    resize() {
        this.groundY = this.canvas.height - 100;
        this.reset();
    }
}

/**
 * 粒子效果类
 * 用于跳跃、碰撞等特效
 */
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
    }
    
    /**
     * 创建跳跃粒子效果
     */
    createJumpEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: random(-2, 2),
                vy: random(-1, -3),
                life: 1,
                decay: random(0.02, 0.05),
                color: '#8B7355',
                size: random(2, 5)
            });
        }
    }
    
    /**
     * 创建碰撞粒子效果
     */
    createCollisionEffect(x, y) {
        const colors = ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'];
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: random(-5, 5),
                vy: random(-5, 5),
                life: 1,
                decay: random(0.02, 0.04),
                color: randomChoice(colors),
                size: random(3, 8)
            });
        }
    }
    
    /**
     * 更新粒子
     */
    update() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // 重力
            particle.life -= particle.decay;
        });
        
        this.particles = this.particles.filter(p => p.life > 0);
    }
    
    /**
     * 绘制粒子
     */
    draw() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
}

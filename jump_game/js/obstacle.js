/**
 * 障碍物基类
 */
class Obstacle {
    constructor(canvas, type) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.type = type;
        this.markedForDeletion = false;
        this.x = canvas.width;
        
        // 速度（会被游戏速度覆盖）
        this.speed = 5;
    }
    
    update(gameSpeed) {
        this.x -= gameSpeed;
        
        // 移出屏幕左侧则标记删除
        if (this.x + this.width < 0) {
            this.markedForDeletion = true;
        }
    }
    
    draw() {
        // 子类实现
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

/**
 * 山峦障碍物
 */
class Mountain extends Obstacle {
    constructor(canvas) {
        super(canvas, 'mountain');
        
        this.width = randomInt(60, 100);
        this.height = randomInt(50, 90);
        this.y = canvas.height - 100 - this.height;
        
        // 山峰颜色
        this.color = randomChoice(['#4a5568', '#2d3748', '#1a202c']);
        this.peakColor = randomChoice(['#e2e8f0', '#cbd5e0', '#a0aec0']);
    }
    
    draw() {
        const ctx = this.ctx;
        
        ctx.save();
        
        // 山体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        
        // 山顶（雪）
        ctx.fillStyle = this.peakColor;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.25, this.y + this.height * 0.5);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width * 0.75, this.y + this.height * 0.5);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}

/**
 * 索玛花（杜鹃花）障碍物 - 低矮障碍物
 */
class Azalea extends Obstacle {
    constructor(canvas) {
        super(canvas, 'azalea');
        
        this.width = 40;
        this.height = 35;
        this.y = canvas.height - 100 - this.height;
        
        // 索玛花颜色（粉红、玫红、白色）
        this.flowerColors = ['#ff6b9d', '#e91e63', '#f8bbd9', '#ff1744'];
        this.flowerColor = randomChoice(this.flowerColors);
    }
    
    draw() {
        const ctx = this.ctx;
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        
        ctx.save();
        
        // 茎
        ctx.strokeStyle = '#2e7d32';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy + 10);
        ctx.lineTo(cx, this.y + this.height);
        ctx.stroke();
        
        // 叶子
        ctx.fillStyle = '#4caf50';
        ctx.beginPath();
        ctx.ellipse(cx - 8, cy + 12, 6, 3, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 8, cy + 12, 6, 3, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 花朵（多层花瓣）
        ctx.fillStyle = this.flowerColor;
        const petalCount = 5;
        const petalRadius = 12;
        
        for (let i = 0; i < petalCount; i++) {
            const angle = (Math.PI * 2 / petalCount) * i - Math.PI / 2;
            const px = cx + Math.cos(angle) * 6;
            const py = cy + Math.sin(angle) * 6;
            
            ctx.beginPath();
            ctx.arc(px, py, petalRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 花心
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

/**
 * 彝族图腾柱障碍物
 */
class Totem extends Obstacle {
    constructor(canvas) {
        super(canvas, 'totem');
        
        this.width = 35;
        this.height = randomInt(60, 90);
        this.y = canvas.height - 100 - this.height;
        
        // 图腾颜色
        this.colors = {
            wood: '#8B4513',
            pattern1: '#DC143C',
            pattern2: '#FFD700',
            pattern3: '#1E90FF'
        };
    }
    
    draw() {
        const ctx = this.ctx;
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        
        ctx.save();
        
        // 柱身
        ctx.fillStyle = this.colors.wood;
        ctx.fillRect(x + 5, y, w - 10, h);
        
        // 顶部装饰
        ctx.fillStyle = this.colors.pattern1;
        ctx.beginPath();
        ctx.moveTo(x + w/2, y - 10);
        ctx.lineTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.closePath();
        ctx.fill();
        
        // 图腾纹样
        const patternHeight = 15;
        const patterns = [
            this.colors.pattern1,
            this.colors.pattern2,
            this.colors.pattern3,
            this.colors.pattern1
        ];
        
        patterns.forEach((color, i) => {
            const py = y + 15 + i * (patternHeight + 5);
            if (py + patternHeight < y + h - 10) {
                ctx.fillStyle = color;
                
                // 绘制几何纹样
                if (i % 2 === 0) {
                    // 菱形
                    ctx.beginPath();
                    ctx.moveTo(x + w/2, py);
                    ctx.lineTo(x + w - 5, py + patternHeight/2);
                    ctx.lineTo(x + w/2, py + patternHeight);
                    ctx.lineTo(x + 5, py + patternHeight/2);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // 横条
                    ctx.fillRect(x + 8, py + 5, w - 16, patternHeight - 10);
                }
            }
        });
        
        // 底部基座
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x, y + h - 10, w, 10);
        
        ctx.restore();
    }
}

/**
 * 老虎障碍物 - 移动障碍物
 */
class Tiger extends Obstacle {
    constructor(canvas) {
        super(canvas, 'tiger');
        
        this.width = 70;
        this.height = 45;
        this.y = canvas.height - 100 - this.height;
        
        // 老虎颜色
        this.bodyColor = '#ff9800';
        this.stripeColor = '#3e2723';
        
        // 动画
        this.frame = 0;
        this.runSpeed = 2;
    }
    
    update(gameSpeed) {
        super.update(gameSpeed);
        
        // 老虎有额外的奔跑动画
        this.frame += 0.2;
        
        // 老虎比普通障碍物移动更快（追逐效果）
        this.x -= this.runSpeed;
    }
    
    draw() {
        const ctx = this.ctx;
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        
        // 奔跑动画偏移
        const runOffset = Math.sin(this.frame) * 3;
        
        ctx.save();
        
        // 身体
        ctx.fillStyle = this.bodyColor;
        ctx.fillRect(x + 15, y + 15, w - 30, h - 25);
        
        // 条纹
        ctx.fillStyle = this.stripeColor;
        ctx.fillRect(x + 25, y + 18, 4, 10);
        ctx.fillRect(x + 35, y + 20, 4, 12);
        ctx.fillRect(x + 45, y + 18, 4, 10);
        
        // 头部
        ctx.fillStyle = this.bodyColor;
        ctx.beginPath();
        ctx.arc(x + w - 15, y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // 耳朵
        ctx.beginPath();
        ctx.arc(x + w - 22, y + 5, 5, 0, Math.PI * 2);
        ctx.arc(x + w - 8, y + 5, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + w - 18, y + 12, 2, 0, Math.PI * 2);
        ctx.arc(x + w - 12, y + 12, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 鼻子
        ctx.fillStyle = '#ff5722';
        ctx.beginPath();
        ctx.arc(x + w - 15, y + 18, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 腿部动画
        ctx.fillStyle = this.bodyColor;
        const legOffset1 = Math.sin(this.frame * 2) * 5;
        const legOffset2 = Math.sin(this.frame * 2 + Math.PI) * 5;
        
        ctx.fillRect(x + 20 + legOffset1, y + h - 20, 8, 20);
        ctx.fillRect(x + 35 - legOffset1, y + h - 20, 8, 20);
        ctx.fillRect(x + w - 35 + legOffset2, y + h - 20, 8, 20);
        ctx.fillRect(x + w - 20 - legOffset2, y + h - 20, 8, 20);
        
        // 尾巴
        ctx.strokeStyle = this.bodyColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x + 15, y + 20);
        ctx.quadraticCurveTo(x - 5, y + 10 + runOffset, x - 10, y + 5);
        ctx.stroke();
        
        ctx.restore();
    }
}

/**
 * 飞鸟障碍物 - 空中障碍物
 */
class Bird extends Obstacle {
    constructor(canvas) {
        super(canvas, 'bird');
        
        this.width = 40;
        this.height = 30;
        // 随机高度（在空中）
        this.y = randomInt(50, canvas.height - 200);
        
        // 鸟类颜色
        this.bodyColor = randomChoice(['#4a5568', '#2d3748', '#1a202c']);
        this.wingColor = '#718096';
        
        // 动画
        this.frame = 0;
        this.wingSpeed = 0.3;
        
        // 飞行波动
        this.baseY = this.y;
        this.flyOffset = random(0, Math.PI * 2);
    }
    
    update(gameSpeed) {
        super.update(gameSpeed);
        
        // 翅膀动画
        this.frame += this.wingSpeed;
        
        // 飞行波动效果
        this.flyOffset += 0.05;
        this.y = this.baseY + Math.sin(this.flyOffset) * 15;
    }
    
    draw() {
        const ctx = this.ctx;
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        
        // 翅膀动画
        const wingFlap = Math.sin(this.frame) * 8;
        
        ctx.save();
        
        // 身体
        ctx.fillStyle = this.bodyColor;
        ctx.beginPath();
        ctx.ellipse(x + w/2, y + h/2, w/2, h/3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 头部
        ctx.beginPath();
        ctx.arc(x + w - 10, y + 8, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x + w - 7, y + 6, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + w - 6, y + 6, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 嘴巴
        ctx.fillStyle = '#f6ad55';
        ctx.beginPath();
        ctx.moveTo(x + w - 2, y + 8);
        ctx.lineTo(x + w + 8, y + 10);
        ctx.lineTo(x + w - 2, y + 12);
        ctx.closePath();
        ctx.fill();
        
        // 翅膀（上下扇动）
        ctx.fillStyle = this.wingColor;
        
        // 左翼
        ctx.beginPath();
        ctx.moveTo(x + 10, y + h/2);
        ctx.lineTo(x - 5, y + h/2 - 15 + wingFlap);
        ctx.lineTo(x + 15, y + h/2 + 5);
        ctx.closePath();
        ctx.fill();
        
        // 右翼
        ctx.beginPath();
        ctx.moveTo(x + w - 10, y + h/2);
        ctx.lineTo(x + w + 5, y + h/2 - 15 + wingFlap);
        ctx.lineTo(x + w - 15, y + h/2 + 5);
        ctx.closePath();
        ctx.fill();
        
        // 尾巴
        ctx.fillStyle = this.bodyColor;
        ctx.beginPath();
        ctx.moveTo(x, y + h/2);
        ctx.lineTo(x - 10, y + h/2 - 5);
        ctx.lineTo(x - 10, y + h/2 + 5);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}

/**
 * 火把障碍物 - 彝族火把节元素
 */
class Torch extends Obstacle {
    constructor(canvas) {
        super(canvas, 'torch');
        
        this.width = 25;
        this.height = 70;
        this.y = canvas.height - 100 - this.height;
        
        // 火把颜色
        this.woodColor = '#4a3728';
        this.flameColors = ['#ff4500', '#ff6347', '#ffa500', '#ffff00'];
        
        // 动画
        this.frame = 0;
        this.flameHeight = 25;
    }
    
    update(gameSpeed) {
        super.update(gameSpeed);
        
        // 火焰动画
        this.frame += 0.15;
        this.flameHeight = 20 + Math.sin(this.frame) * 8;
    }
    
    draw() {
        const ctx = this.ctx;
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        
        ctx.save();
        
        // 木棍
        ctx.fillStyle = this.woodColor;
        ctx.fillRect(x + w/2 - 4, y + 20, 8, h - 20);
        
        // 木棍纹理
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + w/2 - 2, y + 25);
        ctx.lineTo(x + w/2 - 2, y + h - 5);
        ctx.stroke();
        
        // 火焰（多层）
        const flameBaseY = y + 20;
        const centerX = x + w/2;
        
        // 外层火焰（红色）
        ctx.fillStyle = this.flameColors[0];
        ctx.beginPath();
        ctx.moveTo(centerX - 12, flameBaseY);
        ctx.quadraticCurveTo(centerX - 15, flameBaseY - this.flameHeight * 0.5, centerX, flameBaseY - this.flameHeight);
        ctx.quadraticCurveTo(centerX + 15, flameBaseY - this.flameHeight * 0.5, centerX + 12, flameBaseY);
        ctx.closePath();
        ctx.fill();
        
        // 中层火焰（橙色）
        ctx.fillStyle = this.flameColors[2];
        const midFlameHeight = this.flameHeight * 0.7;
        ctx.beginPath();
        ctx.moveTo(centerX - 8, flameBaseY);
        ctx.quadraticCurveTo(centerX - 10, flameBaseY - midFlameHeight * 0.5, centerX, flameBaseY - midFlameHeight);
        ctx.quadraticCurveTo(centerX + 10, flameBaseY - midFlameHeight * 0.5, centerX + 8, flameBaseY);
        ctx.closePath();
        ctx.fill();
        
        // 内层火焰（黄色）
        ctx.fillStyle = this.flameColors[3];
        const innerFlameHeight = this.flameHeight * 0.4;
        ctx.beginPath();
        ctx.moveTo(centerX - 4, flameBaseY);
        ctx.quadraticCurveTo(centerX - 5, flameBaseY - innerFlameHeight * 0.5, centerX, flameBaseY - innerFlameHeight);
        ctx.quadraticCurveTo(centerX + 5, flameBaseY - innerFlameHeight * 0.5, centerX + 4, flameBaseY);
        ctx.closePath();
        ctx.fill();
        
        // 火星粒子效果
        if (Math.random() > 0.7) {
            ctx.fillStyle = '#ffa500';
            const sparkX = centerX + random(-8, 8);
            const sparkY = flameBaseY - random(0, this.flameHeight);
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, random(1, 2), 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 火把顶部绑绳
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(centerX - 10, y + 18, 20, 4);
        
        ctx.restore();
    }
}

/**
 * 障碍物管理器
 */
class ObstacleManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 120; // 初始生成间隔
        this.minSpawnInterval = 60;
        
        // 障碍物类型权重
        this.obstacleTypes = [
            { type: Mountain, weight: 20 },
            { type: Azalea, weight: 25 },
            { type: Totem, weight: 15 },
            { type: Tiger, weight: 10 },
            { type: Bird, weight: 15 },
            { type: Torch, weight: 15 }
        ];
    }
    
    /**
     * 根据权重随机选择障碍物类型
     */
    getRandomObstacleType() {
        const totalWeight = this.obstacleTypes.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const item of this.obstacleTypes) {
            random -= item.weight;
            if (random <= 0) {
                return item.type;
            }
        }
        
        return this.obstacleTypes[0].type;
    }
    
    /**
     * 更新所有障碍物
     */
    update(gameSpeed, score) {
        // 根据分数调整生成频率
        const difficultyMultiplier = Math.min(score / 1000, 1);
        const currentInterval = lerp(this.spawnInterval, this.minSpawnInterval, difficultyMultiplier);
        
        // 生成新障碍物
        this.spawnTimer++;
        if (this.spawnTimer >= currentInterval) {
            this.spawnTimer = 0;
            
            // 确保不会连续生成太近的障碍物
            const lastObstacle = this.obstacles[this.obstacles.length - 1];
            if (!lastObstacle || this.canvas.width - lastObstacle.x > 200) {
                const ObstacleClass = this.getRandomObstacleType();
                this.obstacles.push(new ObstacleClass(this.canvas));
            }
        }
        
        // 更新现有障碍物
        this.obstacles.forEach(obstacle => obstacle.update(gameSpeed));
        
        // 移除标记删除的障碍物
        this.obstacles = this.obstacles.filter(obstacle => !obstacle.markedForDeletion);
    }
    
    /**
     * 绘制所有障碍物
     */
    draw() {
        this.obstacles.forEach(obstacle => obstacle.draw());
    }
    
    /**
     * 检测与玩家的碰撞
     */
    checkCollision(player) {
        const playerBounds = player.getBounds();
        
        for (const obstacle of this.obstacles) {
            if (checkCollision(playerBounds, obstacle.getBounds())) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 重置
     */
    reset() {
        this.obstacles = [];
        this.spawnTimer = 0;
    }
}

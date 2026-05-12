/**
 * 玩家角色类
 * 彝族勇士/ heroine 角色，支持跳跃动画
 */
class Player {
    constructor(canvas, gender = 'male') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 性别: 'male' 或 'female'
        this.gender = gender;
        
        // 基础属性
        this.width = 50;
        this.height = gender === 'female' ? 55 : 60;
        this.x = 100;
        this.y = canvas.height - 100 - this.height;
        this.groundY = canvas.height - 100;
        
        // 跳跃属性
        this.velocityY = 0;
        this.gravity = 0.8;
        this.jumpPower = -16;
        this.isJumping = false;
        this.isGrounded = true;
        
        // 动画属性
        this.frame = 0;
        this.animationSpeed = 0.15;
        
        // 根据性别设置颜色
        this.setColorsByGender();
        
        // 自定义图片（可由外部设置）
        this.customImage = null;
        
        // 状态
        this.isDead = false;
    }
    
    /**
     * 根据性别设置颜色
     */
    setColorsByGender() {
        if (this.gender === 'female') {
            // 女性角色颜色
            this.colors = {
                body: '#8B4513',      // 棕色 - 皮肤
                clothes: '#C71585',   // 紫红色 - 衣服
                skirt: '#4B0082',     // 靛蓝色 - 裙子
                decoration: '#FFD700', // 金色 - 装饰
                hair: '#000000',      // 黑色 - 头发
                hairAccessory: '#FF1493' // 深粉色 - 头饰
            };
        } else {
            // 男性角色颜色
            this.colors = {
                body: '#8B4513',      // 棕色 - 皮肤
                clothes: '#DC143C',   // 深红色 - 衣服
                pants: '#1a1a2e',     // 深蓝黑 - 裤子
                decoration: '#FFD700', // 金色 - 装饰
                hair: '#000000'       // 黑色 - 头发
            };
        }
    }
    
    /**
     * 切换性别
     * @param {string} gender - 'male' 或 'female'
     */
    setGender(gender) {
        this.gender = gender;
        this.height = gender === 'female' ? 55 : 60;
        this.y = this.groundY - this.height;
        this.setColorsByGender();
    }
    
    /**
     * 设置自定义图片
     * @param {HTMLImageElement} image - 自定义角色图片
     */
    setCustomImage(image) {
        this.customImage = image;
    }
    
    /**
     * 跳跃
     */
    jump() {
        if (this.isGrounded && !this.isDead) {
            this.velocityY = this.jumpPower;
            this.isJumping = true;
            this.isGrounded = false;
            return true;
        }
        return false;
    }
    
    /**
     * 更新角色状态
     */
    update() {
        if (this.isDead) return;
        
        // 应用重力
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        
        // 地面检测
        if (this.y >= this.groundY - this.height) {
            this.y = this.groundY - this.height;
            this.velocityY = 0;
            this.isJumping = false;
            this.isGrounded = true;
        }
        
        // 更新动画帧
        this.frame += this.animationSpeed;
    }
    
    /**
     * 绘制角色
     */
    draw() {
        if (this.customImage) {
            this.drawCustomImage();
        } else {
            this.drawDefaultCharacter();
        }
    }
    
    /**
     * 绘制默认角色（彝族勇士/姑娘风格）
     */
    drawDefaultCharacter() {
        if (this.gender === 'female') {
            this.drawFemaleCharacter();
        } else {
            this.drawMaleCharacter();
        }
    }
    
    /**
     * 绘制男性角色
     */
    drawMaleCharacter() {
        const ctx = this.ctx;
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        
        // 奔跑动画偏移
        const runOffset = this.isGrounded ? Math.sin(this.frame * 2) * 3 : 0;
        
        ctx.save();
        
        // 身体（衣服）
        ctx.fillStyle = this.colors.clothes;
        ctx.fillRect(x + 10, y + 15, w - 20, h - 35);
        
        // 裤子
        ctx.fillStyle = this.colors.pants;
        ctx.fillRect(x + 10, y + h - 20, 12, 20);
        ctx.fillRect(x + w - 22, y + h - 20, 12, 20);
        
        // 腿部动画
        if (this.isGrounded) {
            const legOffset = Math.sin(this.frame * 3) * 8;
            ctx.fillRect(x + 10 + legOffset, y + h - 20, 12, 20);
            ctx.fillRect(x + w - 22 - legOffset, y + h - 20, 12, 20);
        } else {
            // 跳跃时腿部姿势
            ctx.fillRect(x + 8, y + h - 25, 12, 25);
            ctx.fillRect(x + w - 20, y + h - 15, 12, 15);
        }
        
        // 头部
        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.arc(x + w/2, y + 12, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // 头发
        ctx.fillStyle = this.colors.hair;
        ctx.beginPath();
        ctx.arc(x + w/2, y + 10, 13, Math.PI, 0);
        ctx.fill();
        
        // 头饰（彝族特色）
        ctx.fillStyle = this.colors.decoration;
        ctx.fillRect(x + w/2 - 15, y - 3, 30, 6);
        ctx.beginPath();
        ctx.moveTo(x + w/2 - 15, y);
        ctx.lineTo(x + w/2 - 20, y - 10);
        ctx.lineTo(x + w/2 - 10, y);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w/2 + 15, y);
        ctx.lineTo(x + w/2 + 20, y - 10);
        ctx.lineTo(x + w/2 + 10, y);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w/2 + 3, y + 10, 3, 3);
        
        // 衣服装饰纹样
        ctx.strokeStyle = this.colors.decoration;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 15, y + 25);
        ctx.lineTo(x + w - 15, y + 25);
        ctx.stroke();
        
        // 手臂
        ctx.fillStyle = this.colors.body;
        if (this.isGrounded) {
            const armOffset = Math.sin(this.frame * 3 + Math.PI) * 6;
            ctx.fillRect(x + 5, y + 20 + armOffset, 8, 18);
            ctx.fillRect(x + w - 13, y + 20 - armOffset, 8, 18);
        } else {
            // 跳跃时手臂上举
            ctx.fillRect(x + 2, y + 15, 8, 18);
            ctx.fillRect(x + w - 10, y + 15, 8, 18);
        }
        
        ctx.restore();
    }
    
    /**
     * 绘制女性角色
     */
    drawFemaleCharacter() {
        const ctx = this.ctx;
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        
        // 奔跑动画偏移
        const runOffset = this.isGrounded ? Math.sin(this.frame * 2) * 3 : 0;
        
        ctx.save();
        
        // 身体（上衣）- 更修身
        ctx.fillStyle = this.colors.clothes;
        ctx.beginPath();
        ctx.moveTo(x + 12, y + 15);
        ctx.lineTo(x + w - 12, y + 15);
        ctx.lineTo(x + w - 8, y + h - 25);
        ctx.lineTo(x + 8, y + h - 25);
        ctx.closePath();
        ctx.fill();
        
        // 裙子（彝族百褶裙风格）
        ctx.fillStyle = this.colors.skirt;
        const skirtY = y + h - 25;
        ctx.beginPath();
        ctx.moveTo(x + 8, skirtY);
        ctx.lineTo(x + w - 8, skirtY);
        ctx.lineTo(x + w - 5, y + h);
        ctx.lineTo(x + 5, y + h);
        ctx.closePath();
        ctx.fill();
        
        // 裙子褶皱
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
            const fx = x + 8 + (w - 16) * i / 4;
            ctx.beginPath();
            ctx.moveTo(fx, skirtY);
            ctx.lineTo(fx + 3, y + h);
            ctx.stroke();
        }
        
        // 腿部动画（裙子下露出一点）
        ctx.fillStyle = this.colors.body;
        if (this.isGrounded) {
            const legOffset = Math.sin(this.frame * 3) * 5;
            ctx.fillRect(x + 14 + legOffset, y + h - 12, 6, 12);
            ctx.fillRect(x + w - 20 - legOffset, y + h - 12, 6, 12);
        } else {
            ctx.fillRect(x + 12, y + h - 15, 6, 15);
            ctx.fillRect(x + w - 18, y + h - 12, 6, 12);
        }
        
        // 头部
        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.arc(x + w/2, y + 10, 11, 0, Math.PI * 2);
        ctx.fill();
        
        // 头发（长发）
        ctx.fillStyle = this.colors.hair;
        // 头顶
        ctx.beginPath();
        ctx.arc(x + w/2, y + 8, 12, Math.PI, 0);
        ctx.fill();
        // 长发（马尾/辫子风格）
        ctx.fillRect(x + 5, y + 8, 8, 20);
        ctx.fillRect(x + w - 13, y + 8, 8, 20);
        // 辫子摆动
        const hairOffset = Math.sin(this.frame * 2) * 3;
        ctx.fillRect(x + 5 + hairOffset, y + 25, 6, 15);
        ctx.fillRect(x + w - 11 + hairOffset, y + 25, 6, 15);
        
        // 头饰（彝族特色 - 更华丽）
        ctx.fillStyle = this.colors.hairAccessory;
        // 头巾/帽子
        ctx.beginPath();
        ctx.moveTo(x + w/2 - 18, y + 5);
        ctx.lineTo(x + w/2, y - 8);
        ctx.lineTo(x + w/2 + 18, y + 5);
        ctx.closePath();
        ctx.fill();
        // 装饰珠串
        ctx.fillStyle = this.colors.decoration;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(x + w/2 - 10 + i * 10, y - 2, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 眼睛（更大更圆）
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + w/2 + 4, y + 9, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 衣服装饰纹样（更精致）
        ctx.strokeStyle = this.colors.decoration;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 12, y + 22);
        ctx.lineTo(x + w - 12, y + 22);
        ctx.stroke();
        // 刺绣图案
        ctx.fillStyle = this.colors.decoration;
        ctx.beginPath();
        ctx.arc(x + w/2, y + 28, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 手臂
        ctx.fillStyle = this.colors.body;
        if (this.isGrounded) {
            const armOffset = Math.sin(this.frame * 3 + Math.PI) * 5;
            ctx.fillRect(x + 6, y + 18 + armOffset, 6, 16);
            ctx.fillRect(x + w - 12, y + 18 - armOffset, 6, 16);
        } else {
            ctx.fillRect(x + 4, y + 15, 6, 16);
            ctx.fillRect(x + w - 10, y + 15, 6, 16);
        }
        
        ctx.restore();
    }
    
    /**
     * 绘制自定义图片
     */
    drawCustomImage() {
        const ctx = this.ctx;
        ctx.drawImage(this.customImage, this.x, this.y, this.width, this.height);
    }
    
    /**
     * 获取碰撞框
     * @returns {Object} 碰撞框数据
     */
    getBounds() {
        // 缩小碰撞框，让游戏体验更好
        const padding = 8;
        return {
            x: this.x + padding,
            y: this.y + padding,
            width: this.width - padding * 2,
            height: this.height - padding * 2
        };
    }
    
    /**
     * 设置死亡状态
     */
    die() {
        this.isDead = true;
    }
    
    /**
     * 重置角色
     */
    reset() {
        this.y = this.groundY - this.height;
        this.velocityY = 0;
        this.isJumping = false;
        this.isGrounded = true;
        this.isDead = false;
        this.frame = 0;
    }
    
    /**
     * 调整大小（响应式）
     * @param {number} scale - 缩放比例
     */
    resize(scale) {
        this.width = 50 * scale;
        this.height = 60 * scale;
        this.groundY = this.canvas.height - 100 * scale;
        this.y = this.groundY - this.height;
        this.jumpPower = -16 * scale;
        this.gravity = 0.8 * scale;
    }
}

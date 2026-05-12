/**
 * 游戏主类
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.state = 'start'; // start, playing, paused, gameover
        this.score = 0;
        this.highScore = Storage.get('yiGameHighScore', 0);
        this.gameSpeed = 5;
        this.baseSpeed = 5;
        this.maxSpeed = 15;
        
        // 游戏对象
        this.background = null;
        this.player = null;
        this.obstacleManager = null;
        this.particles = null;
        
        // 角色性别
        this.selectedGender = 'male';
        
        // 音效
        this.soundManager = new SoundManager();
        
        // 动画帧ID
        this.animationId = null;
        this.lastTime = 0;
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化游戏
     */
    init() {
        // 设置画布大小
        this.resize();
        
        // 初始化游戏对象
        this.background = new Background(this.canvas);
        this.player = new Player(this.canvas, this.selectedGender);
        this.obstacleManager = new ObstacleManager(this.canvas);
        this.particles = new ParticleSystem(this.canvas);
        
        // 绑定事件
        this.bindEvents();
        
        // 更新最高分显示
        document.getElementById('highScore').textContent = Math.floor(this.highScore);
        
        // 初始渲染
        this.draw();
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleJump();
            }
            if (e.code === 'Escape' && this.state === 'playing') {
                this.togglePause();
            }
        });
        
        // 触摸/点击事件
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleJump();
        }, { passive: false });
        
        this.canvas.addEventListener('mousedown', () => {
            this.handleJump();
        });
        
        // 按钮事件
        const startBtn = document.getElementById('startBtn');
        console.log('Start button found:', startBtn);
        
        startBtn.addEventListener('click', (e) => {
            console.log('Start button clicked!');
            e.preventDefault();
            e.stopPropagation();
            this.start();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('homeBtn').addEventListener('click', () => {
            this.goHome();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        // 角色选择事件
        document.querySelectorAll('.character-option').forEach(option => {
            option.addEventListener('click', () => {
                // 移除其他选中状态
                document.querySelectorAll('.character-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                // 添加当前选中状态
                option.classList.add('selected');
                // 保存选择的性别
                this.selectedGender = option.dataset.gender;
            });
        });
        
        // 窗口大小改变
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
    
    /**
     * 处理跳跃
     */
    handleJump() {
        if (this.state === 'playing') {
            if (this.player.jump()) {
                this.particles.createJumpEffect(
                    this.player.x + this.player.width / 2,
                    this.player.y + this.player.height
                );
                this.soundManager.play('jump');
            }
        } else if (this.state === 'start') {
            this.start();
        } else if (this.state === 'gameover') {
            this.restart();
        }
    }
    
    /**
     * 调整画布大小
     */
    resize() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // 设置画布实际像素大小
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // 调整游戏对象大小（基于1200px宽度）
        if (this.player) {
            const scale = this.canvas.width / 1200;
            this.player.resize(scale);
        }
        if (this.background) {
            this.background.resize();
        }
    }
    
    /**
     * 开始游戏
     */
    start() {
        this.state = 'playing';
        this.score = 0;
        this.gameSpeed = this.baseSpeed;
        
        // 隐藏开始界面，显示游戏界面
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('scoreBoard').classList.remove('hidden');
        document.getElementById('timeDisplay').classList.remove('hidden');
        document.getElementById('pauseBtn').classList.remove('hidden');
        
        // 重置游戏对象
        this.player.setGender(this.selectedGender);
        this.player.reset();
        this.obstacleManager.reset();
        this.background.reset();
        this.particles = new ParticleSystem(this.canvas);
        
        // 开始游戏循环
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    /**
     * 重新开始
     */
    restart() {
        this.start();
    }
    
    /**
     * 返回主页
     */
    goHome() {
        this.state = 'start';
        this.score = 0;
        
        // 停止游戏循环
        cancelAnimationFrame(this.animationId);
        
        // 显示开始界面，隐藏其他界面
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('scoreBoard').classList.add('hidden');
        document.getElementById('timeDisplay').classList.add('hidden');
        document.getElementById('pauseBtn').classList.add('hidden');
        
        // 重置游戏对象
        this.player.reset();
        this.obstacleManager.reset();
        this.background.reset();
        
        // 重新渲染初始画面
        this.draw();
    }
    
    /**
     * 暂停/继续
     */
    togglePause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            document.getElementById('pauseBtn').textContent = '▶️';
            cancelAnimationFrame(this.animationId);
        } else if (this.state === 'paused') {
            this.state = 'playing';
            document.getElementById('pauseBtn').textContent = '⏸️';
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }
    
    /**
     * 游戏结束
     */
    gameOver() {
        this.state = 'gameover';
        this.player.die();
        
        // 创建碰撞特效
        this.particles.createCollisionEffect(
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2
        );
        
        // 播放音效
        this.soundManager.play('crash');
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            Storage.set('yiGameHighScore', this.highScore);
        }
        
        // 显示游戏结束界面
        document.getElementById('currentScore').textContent = Math.floor(this.score);
        document.getElementById('highScore').textContent = Math.floor(this.highScore);
        document.getElementById('gameOverScreen').classList.remove('hidden');
        document.getElementById('pauseBtn').classList.add('hidden');
        document.getElementById('timeDisplay').classList.add('hidden');
        
        // 停止游戏循环
        cancelAnimationFrame(this.animationId);
    }
    
    /**
     * 游戏主循环
     */
    gameLoop() {
        if (this.state !== 'playing') return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // 更新
        this.update(deltaTime);
        
        // 绘制
        this.draw();
        
        // 继续循环
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * 更新游戏状态
     */
    update(deltaTime) {
        // 更新分数
        this.score += this.gameSpeed * 0.1;
        document.getElementById('score').textContent = Math.floor(this.score);
        
        // 更新时间显示
        this.updateTimeDisplay();
        
        // 逐渐增加游戏速度
        const speedMultiplier = 1 + (this.score / 5000);
        this.gameSpeed = Math.min(this.baseSpeed * speedMultiplier, this.maxSpeed);
        
        // 更新背景
        this.background.update(this.gameSpeed);
        
        // 更新玩家
        this.player.update();
        
        // 更新障碍物
        this.obstacleManager.update(this.gameSpeed, this.score);
        
        // 更新粒子
        this.particles.update();
        
        // 检测碰撞
        if (this.obstacleManager.checkCollision(this.player)) {
            this.gameOver();
        }
    }
    
    /**
     * 更新时间显示
     */
    updateTimeDisplay() {
        const timeOfDay = this.background.timeOfDay;
        const timeIcon = document.getElementById('timeIcon');
        const timeText = document.getElementById('timeText');
        
        if (timeOfDay < 0.2) {
            timeIcon.textContent = '☀️';
            timeText.textContent = '正午';
        } else if (timeOfDay < 0.4) {
            timeIcon.textContent = '🌤️';
            timeText.textContent = '下午';
        } else if (timeOfDay < 0.6) {
            timeIcon.textContent = '🌅';
            timeText.textContent = '黄昏';
        } else if (timeOfDay < 0.8) {
            timeIcon.textContent = '🌙';
            timeText.textContent = '夜晚';
        } else {
            timeIcon.textContent = '🌑';
            timeText.textContent = '深夜';
        }
    }
    
    /**
     * 绘制游戏画面
     */
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景
        this.background.draw();
        
        // 绘制障碍物
        this.obstacleManager.draw();
        
        // 绘制玩家
        this.player.draw();
        
        // 绘制粒子
        this.particles.draw();
    }
    
    /**
     * 加载自定义角色图片
     * @param {string} imageSrc - 图片路径或DataURL
     */
    loadCustomCharacter(imageSrc) {
        const img = new Image();
        img.onload = () => {
            this.player.setCustomImage(img);
        };
        img.src = imageSrc;
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});

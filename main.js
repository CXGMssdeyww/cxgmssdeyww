// 初始化场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// 创建粒子几何体
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000; // 粒子数量

// 随机生成粒子的位置
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100; // 在 -50 到 50 之间随机分布
}

// 设置粒子位置属性
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// 创建粒子材质
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1, // 粒子大小
    color: 0x00ffcc, // 粒子颜色（青色）
    transparent: true,
    opacity: 0.8,
});

// 创建粒子系统
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// 添加粒子动画
function animateParticles() {
    const positions = particlesGeometry.attributes.position.array;

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // 让粒子在 Z 轴上移动
        positions[i + 2] += 0.1; // Z 轴移动速度

        // 如果粒子超出范围，重置位置
        if (positions[i + 2] > 50) {
            positions[i + 2] = -50;
        }
    }

    // 更新粒子位置
    particlesGeometry.attributes.position.needsUpdate = true;
}

// 添加星空背景
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// 添加动画
function animate() {
    requestAnimationFrame(animate);
    animateParticles();
    stars.rotation.x += 0.0005;
    stars.rotation.y += 0.0005;
    stars.rotation.z += 0.0005;
    renderer.render(scene, camera);
}

animate();

// 添加滚动视差效果
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    camera.position.z = 30 + scrollY * 0.1;
});

// 按钮点击事件
document.getElementById('explore').addEventListener('click', () => {
    gsap.to(camera.position, { z: 10, duration: 2 });
    gsap.to(camera.rotation, { y: Math.PI * 2, duration: 2 });
});

// 添加鼠标交互（背景粒子跟随鼠标移动）
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    // 将鼠标位置归一化到 [-1, 1]
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 让粒子跟随鼠标移动
    camera.position.x = mouse.x * 10; // 调整灵敏度
    camera.position.y = mouse.y * 10;
});

// 添加倒计时功能
function updateCountdown() {
    // 设置目标时间为 24 小时
    let totalSeconds = 24 * 60 * 60; // 24 小时的总秒数

    // 每秒更新一次倒计时
    const countdownInterval = setInterval(() => {
        // 计算小时、分钟、秒
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // 更新倒计时显示
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');

        // 减少总秒数
        totalSeconds--;

        // 如果时间到，停止倒计时
        if (totalSeconds < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerText = "时间到！";
        }

        // 添加闪烁效果
        const countdownElement = document.getElementById('countdown');
        countdownElement.style.animation = 'none'; // 重置动画
        setTimeout(() => {
            countdownElement.style.animation = 'blink 1s ease-in-out'; // 重新触发动画
        }, 10);
    }, 1000);
}

// 启动倒计时
updateCountdown();
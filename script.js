document.addEventListener("DOMContentLoaded", function () {
    // 背景音乐控制
    const music = document.getElementById("bg-music");
    const musicToggle = document.getElementById("music-toggle");
    let isPlaying = false;

    // 播放状态同步
    music.addEventListener('ended', () => {
        isPlaying = false;
        musicToggle.textContent = "🔇";
    });

    // 修改script.js中的音乐控制部分
musicToggle.addEventListener("click", function () {
  if (isPlaying) {
    music.pause();
    musicToggle.textContent = "🔇";
    musicToggle.classList.remove("rotate"); // 停止旋转
  } else {
    music.play().catch(() => {
      alert("请点击页面任意位置后，再开启音乐！");
    });
    musicToggle.textContent = "🎵"; 
    musicToggle.classList.add("rotate"); // 开始旋转
  }
  isPlaying = !isPlaying;
});

// 添加音乐暂停监听(确保意外暂停时同步状态)
music.addEventListener('pause', () => {
  musicToggle.classList.remove("rotate");
  isPlaying = false;
});

    // 导航栏激活逻辑
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('article, footer');

    const activateNav = () => {
        let currentSection = '';
        sections.forEach(section => {
            const { top, height } = section.getBoundingClientRect();
            if (top <= window.innerHeight * 0.3 && top + height >= 0) {
                currentSection = section.id;
            }
        });
        navItems.forEach(item => {
            item.classList.toggle('active', item.hash === `#${currentSection}`);
        });
    };

    // 防抖滚动监听（100ms）
    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            document.body.classList.toggle('scrolled', window.scrollY > 100);
            activateNav();
        }, 100);
    }, { passive: true });

    // 涟漪效果（修复定位）
    navItems.forEach(link => {
        link.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            const ripple = document.createElement('div');
            Object.assign(ripple.style, {
                width: `${size}px`,
                height: `${size}px`,
                left: `${e.clientX - rect.left - size/2}px`,
                top: `${e.clientY - rect.top - size/2}px`,
                position: 'absolute'
            });
            
            ripple.className = 'ripple-effect';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    activateNav(); // 初始激活
});
// 更新当前年份
document.getElementById('current-year').textContent = new Date().getFullYear();

// 文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // 如果在移动端，点击导航链接后关闭菜单
            const nav = document.getElementById('hero-nav');
            const mobileNav = document.getElementById('mobile-nav');
            
            if (nav.classList.contains('is-active')) {
                nav.classList.remove('is-active');
            }
            
            if (mobileNav && mobileNav.classList.contains('is-active')) {
                mobileNav.classList.remove('is-active');
                document.body.classList.remove('menu-open');
            }
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 导航栏高亮当前部分
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.hero-nav a, .mobile-nav a');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 移动端菜单功能
    initMobileMenu();

    // 淡入动画
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    // 为元素添加动画效果
    document.querySelectorAll('.section-title, .about-layout, .skill-card, .timeline-item, .education-card, .project-card, .contact-item').forEach(el => {
        el.classList.add('fade-in-effect');
        fadeInObserver.observe(el);
    });

    // 技能进度条动画
    const skillItems = document.querySelectorAll('.skill-list li');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
    
    // 项目卡片淡入效果
    const projectCards = document.querySelectorAll('.project-card');
    
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                projectObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    projectCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        projectObserver.observe(card);
    });
    
    // 时间线项目动画
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateX(0)';
                }, 200);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    timelineItems.forEach((item, index) => {
        const isEven = index % 2 === 0;
        item.style.opacity = 0;
        item.style.transform = isEven ? 'translateX(-20px)' : 'translateX(20px)';
        item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        timelineObserver.observe(item);
    });

    // 页面加载时添加动画类
    // 为所有section添加动画类
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in-effect');
    });
    
    // 为timeline-item添加动画类
    document.querySelectorAll('.timeline-item, .project-card, .education-card, .skill-card, .contact-item').forEach(item => {
        item.classList.add('fade-in-effect');
    });
    
    // 安全的滚动动画
    initScrollAnimations();

    // 初始化幻灯片功能
    initSlideshow();
    
    // 初始化弹窗功能
    initModal();
    
    // 添加图片错误处理，当图片加载失败时移除元素
    document.addEventListener('error', function(e) {
        if (e.target.tagName.toLowerCase() === 'img') {
            console.log('图片加载失败:', e.target.src);
            // 如果是幻灯片中的图片，则从DOM中移除
            if (e.target.classList.contains('slideshow-img')) {
                e.target.parentNode.removeChild(e.target);
            }
        }
    }, true);
});

// 在CSS中添加以下类以支持动画
/*
.fade-in-effect {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in-visible {
    opacity: 1;
    transform: translateY(0);
}
*/

// 安全的滚动动画
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // 动画只触发一次
            }
        });
    }, {
        threshold: 0.1 // 元素进入视口10%时触发
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 幻灯片功能
function initSlideshow() {
    // 找到所有带data-folder属性的幻灯片
    const slideshows = document.querySelectorAll('.project-image[data-folder]');
    
    slideshows.forEach(slideshow => {
        const imageFolder = slideshow.getAttribute('data-folder');
        const container = slideshow.querySelector('.slideshow-container');
        const prevBtn = slideshow.querySelector('.prev-btn');
        const nextBtn = slideshow.querySelector('.next-btn');
        let slides = [];
        let currentSlide = 0;
        let slideInterval;
        let touchStartX = 0;
        let touchEndX = 0;

        // 动态加载图片
        loadImagesFromFolder(imageFolder, container).then(imageElements => {
            slides = imageElements;
            if (slides.length > 0) {
                // 初始显示第一张幻灯片
                showSlide(0);
                // 开始自动切换
                startSlideshow();
            }
        });

        // 显示指定索引的幻灯片
        function showSlide(index) {
            if (!slides.length) return;
            
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            slides[index].classList.add('active');
        }

        // 下一张幻灯片
        function nextSlide() {
            if (!slides.length) return;
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // 上一张幻灯片
        function prevSlide() {
            if (!slides.length) return;
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        // 开始自动切换
        function startSlideshow() {
            if (!slides.length) return;
            slideInterval = setInterval(nextSlide, 3000);
        }

        // 停止自动切换
        function stopSlideshow() {
            clearInterval(slideInterval);
        }

        // 按钮事件
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                stopSlideshow();
                prevSlide();
                startSlideshow();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                stopSlideshow();
                nextSlide();
                startSlideshow();
            });
        }

        // 触摸事件支持
        container.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopSlideshow();
        }, {passive: true});

        container.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startSlideshow();
        }, {passive: true});

        function handleSwipe() {
            const threshold = 50; // 最小滑动距离
            if (touchEndX - touchStartX > threshold) {
                // 向右滑动，显示上一张
                prevSlide();
            } else if (touchStartX - touchEndX > threshold) {
                // 向左滑动，显示下一张
                nextSlide();
            }
        }

        // 鼠标悬停时暂停
        container.addEventListener('mouseenter', stopSlideshow);
        container.addEventListener('mouseleave', startSlideshow);
    });

    // 兼容旧代码，处理已有的book-system-slideshow
    const oldSlideshow = document.getElementById('book-system-slideshow');
    if (oldSlideshow && !oldSlideshow.getAttribute('data-folder')) {
        const slides = oldSlideshow.querySelectorAll('.slideshow-img');
        if (slides.length === 0) return;
        
        const prevBtn = oldSlideshow.querySelector('.prev-btn');
        const nextBtn = oldSlideshow.querySelector('.next-btn');
        let currentSlide = 0;
        let slideInterval;

        // 显示指定索引的幻灯片
        function showSlide(index) {
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            slides[index].classList.add('active');
        }

        // 下一张幻灯片
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // 上一张幻灯片
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        // 开始自动切换
        function startSlideshow() {
            slideInterval = setInterval(nextSlide, 3000);
        }

        // 停止自动切换
        function stopSlideshow() {
            clearInterval(slideInterval);
        }

        // 设置控制按钮
        if (prevBtn) prevBtn.addEventListener('click', function() {
            prevSlide();
        });
        
        if (nextBtn) nextBtn.addEventListener('click', function() {
            nextSlide();
        });

        // 初始显示第一张幻灯片
        showSlide(0);
        
        // 开始自动切换
        startSlideshow();
        
        // 项目卡片悬停时停止自动切换
        const projectCard = oldSlideshow.closest('.project-card');
        if (projectCard) {
            projectCard.addEventListener('mouseenter', stopSlideshow);
            projectCard.addEventListener('mouseleave', startSlideshow);
        }
    }
}

// 动态加载文件夹中的图片
async function loadImagesFromFolder(folderPath, container) {
    // 在实际项目中，应该使用服务器端API来获取文件夹中的图片
    // 这里我们使用常见的图片扩展名来尝试加载图片
    
    // 这里模拟从服务器获取的图片文件名列表
    // 在实际项目中，这部分需要替换为真实的API调用
    // 例如通过AJAX调用后端API来获取文件列表
    
    // 这里我们尝试加载常见的图像文件名格式
    const possibleImages = [];
    
    // 尝试加载从文件夹中找到的PNG图片
    const files = await getFilesInFolder(folderPath);
    
    // 创建并添加图片元素
    const imageElements = [];
    
    files.forEach((file, index) => {
        const imgPath = `${folderPath}/${file}`;
        const img = document.createElement('img');
        img.src = imgPath;
        img.alt = `项目图片 ${index + 1}`;
        img.className = 'slideshow-img';
        img.style.cursor = 'pointer'; // 添加鼠标指针样式，表明可点击
        if (index === 0) {
            img.classList.add('active');
        }
        container.appendChild(img);
        imageElements.push(img);
    });
    
    return imageElements;
}

// 模拟获取文件夹中的文件列表
// 在实际项目中，这应该是一个服务器端API调用
async function getFilesInFolder(folderPath) {
    // 这里模拟一些可能的图片文件名
    // 在实际应用中，应该从后端API获取真实的文件列表
    
    // 尝试一些常见的图片命名模式
    const commonPatterns = [
        // 数字命名
        '1.png', '2.png', '3.png', '4.png', '5.png',
        // 名称前缀
        'img1.png', 'img2.png', 'img3.png',
        'image1.png', 'image2.png', 'image3.png',
        'pic1.png', 'pic2.png', 'pic3.png',
        'photo1.png', 'photo2.png', 'photo3.png',
        // 描述性命名
        'front.png', 'back.png', 'side.png', 'detail.png',
        'main.png', 'header.png', 'overview.png',
        // 电商相关
        'product.png', 'cart.png', 'checkout.png', 'order.png',
        // 系统界面
        'dashboard.png', 'login.png', 'profile.png', 'admin.png',
        'index.png', 'home.png', 'menu.png',
        // web相关
        'web.png', 'web1.png', 'web2.png', 'web3.png',
        // back相关
        'back.png', 'back1.png', 'back2.png', 'back3.png',
        // book相关 (针对图书系统)
        'book.png', 'read.png', 'library.png'
    ];
    
    // 根据文件夹选择不同的文件集合
    let filesToCheck;
    if (folderPath.includes('1')) {
        filesToCheck = ['web.png', 'web2.png', 'web3.png', 'back1.png', 'back2.png'];
    } else if (folderPath.includes('2')) {
        filesToCheck = ['index.png', 'book.png', 'login.png', 'read.png', 'back.png'];
    } else if (folderPath.includes('3')) {
        filesToCheck = commonPatterns; // 使用所有可能的模式
    } else {
        filesToCheck = commonPatterns;
    }
    
    // 模拟检查文件是否存在
    // 在实际项目中，这部分应该由服务器完成
    const foundFiles = [];
    
    // 假装我们正在检查文件是否存在
    // 这里实际上我们只是根据文件夹路径返回预定义的文件列表
    for (const file of filesToCheck) {
        const img = new Image();
        img.src = `${folderPath}/${file}`;
        
        try {
            // 我们这里没法真正检查文件是否存在，但在实际项目中
            // 这部分应该由服务器API完成，返回真实存在的文件列表
            
            // 在客户端脚本中，我们只能假装文件存在，然后让浏览器
            // 在加载图片时处理不存在的情况
            foundFiles.push(file);
        } catch (e) {
            // 忽略错误
            console.log(`Image ${file} might not exist`);
        }
    }
    
    return foundFiles;
}

// 弹窗功能
function initModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeModal = document.querySelector('.close-modal');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    
    if (!modal || !modalImg) return;
    
    // 查找所有项目幻灯片
    const slideshows = document.querySelectorAll('.project-image');
    
    // 当前查看的图片集合和索引
    let currentSlides = [];
    let currentIndex = 0;
    
    // 显示弹窗
    function showModal(slides, index) {
        currentSlides = slides;
        currentIndex = index;
        
        if (slides.length === 0 || !slides[index]) return;
        
        modalImg.src = slides[index].src;
        modal.style.display = 'block';
    }
    
    // 关闭弹窗
    function hideModal() {
        modal.style.display = 'none';
    }
    
    // 显示下一张
    function showNext() {
        if (currentSlides.length === 0) return;
        
        currentIndex = (currentIndex + 1) % currentSlides.length;
        modalImg.src = currentSlides[currentIndex].src;
    }
    
    // 显示上一张
    function showPrev() {
        if (currentSlides.length === 0) return;
        
        currentIndex = (currentIndex - 1 + currentSlides.length) % currentSlides.length;
        modalImg.src = currentSlides[currentIndex].src;
    }
    
    // 为所有轮播图添加点击事件
    slideshows.forEach(slideshow => {
        // 设置事件委托，处理动态加载的图片点击
        slideshow.addEventListener('click', function(e) {
            const clickedElement = e.target;
            
            // 如果点击的是轮播图片
            if (clickedElement.classList.contains('slideshow-img')) {
                const allSlides = Array.from(slideshow.querySelectorAll('.slideshow-img'));
                const clickedIndex = allSlides.indexOf(clickedElement);
                
                if (clickedIndex !== -1) {
                    showModal(allSlides, clickedIndex);
                }
            }
        });
    });
    
    // 为新的动态加载的轮播图添加点击事件
    document.addEventListener('DOMContentLoaded', () => {
        const dynamicSlideshows = document.querySelectorAll('.slideshow-container');
        dynamicSlideshows.forEach(container => {
            container.style.cursor = 'pointer';
        });
    });
    
    // 添加关闭按钮事件
    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }
    
    // 添加点击弹窗背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // 添加上一张/下一张按钮事件
    if (modalPrev) modalPrev.addEventListener('click', showPrev);
    if (modalNext) modalNext.addEventListener('click', showNext);
    
    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                showPrev();
            } else if (e.key === 'ArrowRight') {
                showNext();
            } else if (e.key === 'Escape') {
                hideModal();
            }
        }
    });
}

// 移动端菜单功能
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const heroNav = document.getElementById('hero-nav');
    const mobileNav = document.getElementById('mobile-nav');

    if (!menuBtn) return;

    menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 切换移动导航菜单
        if (mobileNav) {
            mobileNav.classList.toggle('is-active');
            document.body.classList.toggle('menu-open');
        }
        
        // 切换菜单按钮样式
        menuBtn.classList.toggle('is-active');
        
        // 禁止/启用背景滚动
        if (mobileNav && mobileNav.classList.contains('is-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // 添加页面滚动事件，滚动时如果菜单打开则关闭它
    window.addEventListener('scroll', function() {
        if (mobileNav && mobileNav.classList.contains('is-active')) {
            mobileNav.classList.remove('is-active');
            menuBtn.classList.remove('is-active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
    });
    
    // 添加窗口大小变化检测，在宽屏设备上关闭移动菜单
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992 && mobileNav && mobileNav.classList.contains('is-active')) {
            mobileNav.classList.remove('is-active');
            menuBtn.classList.remove('is-active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
    });
} 
// 更新当前年份
document.getElementById('current-year').textContent = new Date().getFullYear();

// 文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const mobileNav = document.getElementById('mobile-nav');
            if (mobileNav && mobileNav.classList.contains('is-active')) {
                mobileNav.classList.remove('is-active');
                document.body.classList.remove('menu-open');
                document.getElementById('mobile-menu-btn').classList.remove('is-active');
                document.body.style.overflow = '';
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
        const scrollPosition = window.pageYOffset + window.innerHeight / 2;
        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop) {
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
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    document.querySelectorAll('.section').forEach(el => {
        fadeInObserver.observe(el);
    });
    
    // 项目卡片淡入效果
    const projectCards = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, i * 150);
                projectObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    projectCards.forEach(card => {
        projectObserver.observe(card);
    });

    // 初始化幻灯片功能
    initSlideshow();
    
    // 初始化弹窗功能
    initModal();
});

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (!menuBtn || !mobileNav) return;

    menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const isActive = mobileNav.classList.toggle('is-active');
        menuBtn.classList.toggle('is-active');
        document.body.style.overflow = isActive ? 'hidden' : '';
    });
}

// 幻灯片功能
function initSlideshow() {
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

        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        container.appendChild(loadingIndicator);

        const imageMap = {
            'images/1': ['web.png', 'web2.png', 'web3.png', 'back1.png', 'back2.png'],
            'images/2': ['index.png', 'book.png', 'read.png', 'login.png', 'back.png'],
            'images/3': ['1.png', '2.png', '3.png'] 
        };

        const imagesToLoad = imageMap[imageFolder];

        if (imagesToLoad && imagesToLoad.length > 0) {
            loadImages(imageFolder, imagesToLoad, container).then(imageElements => {
                container.querySelector('.loading-indicator')?.remove();
                slides = imageElements;
                if (slides.length > 0) {
                    showSlide(0);
                    startSlideshow();
                } else {
                    container.innerHTML = '<div class="loading-error">图片加载失败</div>';
                }
            });
        } else {
            container.querySelector('.loading-indicator')?.remove();
            container.innerHTML = '<div class="loading-error">未找到图片</div>';
        }

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }

        function changeSlide(direction) {
            const newIndex = (currentSlide + direction + slides.length) % slides.length;
            currentSlide = newIndex;
            showSlide(currentSlide);
            resetInterval();
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => changeSlide(1), 3000);
        }

        function startSlideshow() {
            resetInterval();
        }

        prevBtn.addEventListener('click', () => changeSlide(-1));
        nextBtn.addEventListener('click', () => changeSlide(1));
        container.addEventListener('mouseenter', () => clearInterval(slideInterval));
        container.addEventListener('mouseleave', startSlideshow);

        container.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(slideInterval);
        }, { passive: true });

        container.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchEndX - touchStartX > 50) changeSlide(-1);
            else if (touchStartX - touchEndX > 50) changeSlide(1);
            startSlideshow();
        }, { passive: true });
    });
}

function loadImages(folderPath, imageNames, container) {
    const promises = imageNames.map(name => {
        return new Promise((resolve, reject) => {
            const imgPath = `${folderPath}/${name}`;
            const img = document.createElement('img');
            img.src = imgPath;
            img.alt = `项目图片`;
            img.className = 'slideshow-img';
            img.style.cursor = 'pointer';
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.error(`图片加载失败: ${imgPath}`);
                resolve(null); // 返回 null 表示加载失败
            };
            container.appendChild(img);
        });
    });

    return Promise.all(promises).then(results => {
        const loadedImages = results.filter(img => img !== null);
        // 为弹窗功能添加点击事件
        loadedImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                const modal = document.getElementById('image-modal');
                if (modal) {
                    modal.showModal(loadedImages.map(i => i.src), index);
                }
            });
        });
        return loadedImages;
    });
}

function initModal() {
    const modal = document.getElementById('image-modal');
    if (!modal) return;

    const modalImg = document.getElementById('modal-image');
    const closeModal = modal.querySelector('.close-modal');
    const modalPrev = modal.querySelector('#modal-prev');
    const modalNext = modal.querySelector('#modal-next');
    let currentImages = [];
    let currentIndex = 0;

    function updateModalImage() {
        if (currentImages.length > 0) {
            modalImg.src = currentImages[currentIndex];
        }
    }

    function changeImage(direction) {
        currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
        updateModalImage();
    }

    modal.showModal = (images, index) => {
        currentImages = images;
        currentIndex = index;
        updateModalImage();
        modal.style.display = 'block';
    };
    
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    modalPrev.addEventListener('click', () => changeImage(-1));
    modalNext.addEventListener('click', () => changeImage(1));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
} 
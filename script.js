document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupMobileMenu();
    setupSmoothScroll();
    setupHeaderScroll();
    setupGaleriaTestimonials();
    setupVideoModal();
    setupVideosSection();
    setupRepertorioSlider();
    setupTestimonialSlider();
    setupScrollAnimations();
    updateCurrentYear();
    setupLazyLoading();
    if (typeof feather !== 'undefined') feather.replace();
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        const spans = menuToggle.querySelectorAll('span');
        if (nav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });

    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });
}

function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const handleScroll = debounce(() => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10);

    window.addEventListener('scroll', handleScroll);
}

var GALERIA_MOMENTOS = [
    {
        src: './public/img/casamento.jpg',
        name: 'Cerimônia de Casamento',
        designation: 'Igreja São Bento — São Paulo',
        quote: 'A música clássica elevou cada instante da cerimônia, criando uma atmosfera inesquecível.',
        alt: 'Cerimônia de casamento elegante'
    },
    {
        src: './public/img/corporativo.jpg',
        name: 'Momento Musical em Escadaria',
        designation: 'Apresentação ao ar livre',
        quote: 'O violino em destaque nas escadas trouxe emoção e elegância para esse momento único da cerimônia.',
        alt: 'Violinista em apresentação ao ar livre em escadaria'
    },
    {
        src: './public/img/edsonEscaria.jpg',
        name: 'Duo na Escadaria',
        designation: 'Cerimônia ao ar livre — violino e violão',
        quote: 'Na mesma cerimônia, o violão se juntou ao violino nas escadas e deu a trilha daquele dia. O duo Ligature em um dos momentos mais especiais do casamento.',
        alt: 'Edson tocando violão na escadaria, mesmo evento'
    },
    {
        src: './public/img/bar-terraco-italia-2.jpg',
        name: 'Casamento ao Ar Livre',
        designation: 'Fazenda Vila Rica — Itatiba',
        quote: 'Ao ar livre, a música se integrou à natureza e à celebração dos noivos.',
        alt: 'Casamento ao ar livre'
    },
    {
        src: './public/img/pedido_elegante.jpg',
        name: 'Pedido de Casamento',
        designation: 'Jardim Botânico — São Paulo',
        quote: 'Um pedido de casamento repleto de emoção e beleza musical.',
        alt: 'Pedido de casamento romântico'
    },
    {
        src: './public/img/aniversario_casamento.jpg',
        name: 'Aniversário de 50 Anos',
        designation: 'Clube Hípico — Campinas',
        quote: 'Celebramos 50 anos de união com música que emocionou toda a família.',
        alt: 'Aniversário elegante'
    },
    {
        src: './public/img/recepcao.jpg',
        name: 'Recepção de Casamento',
        designation: 'Palácio dos Cedros — São Paulo',
        quote: 'A recepção ganhou vida com arranjos personalizados e muito sentimento.',
        alt: 'Recepção de casamento'
    }
];

function setupGaleriaTestimonials() {
    const root = document.getElementById('galeria-testimonials');
    const imagesWrap = document.getElementById('galeria-testimonials-images');
    const titleEl = document.getElementById('galeria-testimonials-title');
    const designationEl = document.getElementById('galeria-testimonials-designation');
    const quoteEl = document.getElementById('galeria-testimonials-quote');
    const prevBtn = root && root.querySelector('.galeria-testimonials-prev');
    const nextBtn = root && root.querySelector('.galeria-testimonials-next');

    if (!root || !imagesWrap || !titleEl || !designationEl || !quoteEl || !prevBtn || !nextBtn) return;

    var activeIndex = 0;
    var autoplayTimer = null;
    var autoplayDelay = 5000;

    function buildImages() {
        imagesWrap.innerHTML = '';
        GALERIA_MOMENTOS.forEach(function (m, i) {
            var wrap = document.createElement('div');
            wrap.className = 'galeria-testimonials-image' + (i === 0 ? ' is-active' : '');
            wrap.setAttribute('data-index', i);
            var img = document.createElement('img');
            img.src = m.src;
            img.alt = m.alt;
            img.loading = i === 0 ? 'eager' : 'lazy';
            wrap.appendChild(img);
            imagesWrap.appendChild(wrap);
        });
    }

    function updateContent() {
        var m = GALERIA_MOMENTOS[activeIndex];
        titleEl.textContent = m.name;
        designationEl.textContent = m.designation;
        quoteEl.textContent = m.quote;
        quoteEl.style.opacity = '0';
        requestAnimationFrame(function () {
            quoteEl.style.opacity = '1';
        });
    }

    function setActive(index) {
        activeIndex = (index + GALERIA_MOMENTOS.length) % GALERIA_MOMENTOS.length;
        imagesWrap.querySelectorAll('.galeria-testimonials-image').forEach(function (el, i) {
            el.classList.toggle('is-active', i === activeIndex);
        });
        updateContent();
        if (typeof feather !== 'undefined') feather.replace();
    }

    function goNext() {
        setActive(activeIndex + 1);
        resetAutoplay();
    }

    function goPrev() {
        setActive(activeIndex - 1);
        resetAutoplay();
    }

    function resetAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(goNext, autoplayDelay);
    }

    buildImages();
    updateContent();
    resetAutoplay();

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    imagesWrap.addEventListener('click', function (e) {
        var img = e.target.closest('.galeria-testimonials-image.is-active img');
        if (!img) return;
        var modal = document.getElementById('modal-galeria');
        var modalImg = document.getElementById('modal-image');
        var modalCaption = document.getElementById('modal-caption');
        if (modal && modalImg && modalCaption) {
            var m = GALERIA_MOMENTOS[activeIndex];
            modalImg.src = m.src;
            modalImg.alt = m.alt;
            modalCaption.innerHTML = '<h4>' + m.name + '</h4><p>' + m.designation + '</p>';
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            setTimeout(function () { modal.style.opacity = '1'; }, 10);
        }
    });

    var modal = document.getElementById('modal-galeria');
    var closeModal = document.querySelector('#modal-galeria .modal-close');
    if (modal && closeModal) {
        function closeModalFn() {
            modal.style.opacity = '0';
            setTimeout(function () {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
        closeModal.addEventListener('click', closeModalFn);
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModalFn();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.style.display === 'block') closeModalFn();
        });
    }
}

function setupVideoModal() {
    const modal = document.getElementById('modal-video');
    const iframe = document.getElementById('video-iframe');
    const closeBtn = document.getElementById('modal-video-close');

    if (!modal || !iframe || !closeBtn) return;

    function closeModal() {
        modal.style.display = 'none';
        iframe.src = '';
        document.body.style.overflow = 'auto';
    }

    window.openVideoModal = function(embedUrl) {
        if (!embedUrl) return;
        var sep = embedUrl.indexOf('?') >= 0 ? '&' : '?';
        iframe.src = embedUrl + sep + 'autoplay=1';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        if (typeof feather !== 'undefined') feather.replace();
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });
}

var VIDEOS_YOUTUBE = [
    { id: '7eqICIY0A6A', title: 'Hallelujah (Leonard Cohen)', short: true },
    { id: '-Q15TaDfcbo', title: 'Agnus Dei no violino', short: true }
];

function setupVideosSection() {
    var slider = document.getElementById('videos-slider');
    var track = document.getElementById('videos-track');
    if (!slider || !track || !VIDEOS_YOUTUBE.length) return;

    var trackWrap = slider.querySelector('.videos-track-wrap');
    var prevBtn = slider.querySelector('.videos-prev');
    var nextBtn = slider.querySelector('.videos-next');
    var dotsEl = slider.querySelector('.videos-dots');
    if (!trackWrap || !prevBtn || !nextBtn || !dotsEl) return;

    var gapPx = 24;

    function embedUrl(id) {
        return 'https://www.youtube.com/embed/' + encodeURIComponent(id);
    }

    function youtubeUrl(id, isShort) {
        return isShort
            ? 'https://www.youtube.com/shorts/' + encodeURIComponent(id)
            : 'https://www.youtube.com/watch?v=' + encodeURIComponent(id);
    }

    function thumbnailUrl(id) {
        return 'https://img.youtube.com/vi/' + encodeURIComponent(id) + '/hqdefault.jpg';
    }

    function buildCards() {
        track.innerHTML = '';
        VIDEOS_YOUTUBE.forEach(function(v, i) {
            var isShort = !!v.short;
            var card = document.createElement('div');
            card.className = 'videos-card';
            card.setAttribute('data-embed-url', embedUrl(v.id));
            card.setAttribute('data-youtube-url', youtubeUrl(v.id, isShort));
            card.setAttribute('data-short', isShort ? 'true' : 'false');
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', isShort ? 'Assistir no YouTube: ' + v.title : 'Assistir: ' + v.title);
            card.innerHTML =
                '<div class="videos-card-thumb">' +
                '<img src="' + thumbnailUrl(v.id) + '" alt="" loading="' + (i === 0 ? 'eager' : 'lazy') + '">' +
                '<div class="videos-card-play"><i data-feather="play-circle"></i></div>' +
                (isShort ? '<span class="videos-card-badge">Abre no YouTube</span>' : '') +
                '</div>' +
                '<div class="videos-card-title">' + (v.title || 'Vídeo') + '</div>';
            track.appendChild(card);
        });
        if (typeof feather !== 'undefined') feather.replace();

        track.querySelectorAll('.videos-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var isShort = this.getAttribute('data-short') === 'true';
                if (isShort) {
                    var url = this.getAttribute('data-youtube-url');
                    if (url) window.open(url, '_blank', 'noopener,noreferrer');
                } else {
                    var embedUrl = this.getAttribute('data-embed-url');
                    if (embedUrl && window.openVideoModal) window.openVideoModal(embedUrl);
                }
            });
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    function getVisibleCount() {
        var w = window.innerWidth;
        if (w >= 1280) return 3;
        if (w >= 768) return 2;
        return 1;
    }

    var cards = [];
    function refreshCards() {
        cards = track.querySelectorAll('.videos-card');
    }

    var currentIndex = 0;
    var visibleCount = getVisibleCount();

    function getMaxIndex() {
        return Math.max(0, cards.length - getVisibleCount());
    }

    function updateTrack() {
        visibleCount = getVisibleCount();
        slider.setAttribute('data-visible', String(visibleCount));
        var maxIndex = getMaxIndex();
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        refreshCards();
        if (!cards.length) return;
        var cardWidth = cards[0].offsetWidth;
        var stepPx = cardWidth + gapPx;
        var offsetPx = currentIndex * stepPx;
        track.style.transform = 'translateX(-' + offsetPx + 'px)';
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        dotsEl.querySelectorAll('.videos-dot').forEach(function(dot, i) {
            dot.classList.toggle('is-active', i === currentIndex);
        });
    }

    function buildDots() {
        dotsEl.innerHTML = '';
        var count = getMaxIndex() + 1;
        for (var i = 0; i < count; i++) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'videos-dot' + (i === 0 ? ' is-active' : '');
            btn.setAttribute('aria-label', 'Vídeo ' + (i + 1));
            btn.addEventListener('click', function(j) {
                return function() {
                    currentIndex = j;
                    updateTrack();
                };
            }(i));
            dotsEl.appendChild(btn);
        }
    }

    buildCards();
    refreshCards();
    buildDots();
    updateTrack();

    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateTrack();
        }
    });
    nextBtn.addEventListener('click', function() {
        var maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateTrack();
        }
    });

    window.addEventListener('resize', function() {
        var maxIndex = getMaxIndex();
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        buildDots();
        updateTrack();
    });
}

function setupRepertorioSlider() {
    const slider = document.querySelector('.repertorio-slider');
    if (!slider) return;
    const trackWrap = slider.querySelector('.repertorio-track-wrap');
    const track = slider.querySelector('.repertorio-track');
    const cards = slider.querySelectorAll('.repertorio-card');
    const prevBtn = slider.querySelector('.repertorio-prev');
    const nextBtn = slider.querySelector('.repertorio-next');
    const dotsEl = slider.querySelector('.repertorio-dots');
    if (!trackWrap || !track || !cards.length || !dotsEl) return;

    const gapPx = 16;

    function getVisibleCount() {
        const w = window.innerWidth;
        if (w >= 1280) return 3;
        if (w >= 768) return 2;
        return 1;
    }

    let currentIndex = 0;
    let visibleCount = getVisibleCount();
    let autoPlayTimer = null;
    let autoPlayPausedUntil = 0;

    function getMaxIndex() {
        return Math.max(0, cards.length - getVisibleCount());
    }

    function updateTrack() {
        visibleCount = getVisibleCount();
        slider.setAttribute('data-visible', String(visibleCount));
        const maxIndex = getMaxIndex();
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        void trackWrap.offsetWidth;
        const cardWidth = cards[0] ? cards[0].offsetWidth : 0;
        const stepPx = cardWidth + gapPx;
        const offsetPx = currentIndex * stepPx;
        track.style.transform = `translateX(-${offsetPx}px)`;
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        dotsEl.querySelectorAll('.repertorio-dot').forEach((dot, i) => {
            dot.classList.toggle('is-active', i === currentIndex);
        });
    }

    function buildDots() {
        dotsEl.innerHTML = '';
        const count = getMaxIndex() + 1;
        for (let i = 0; i < count; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'repertorio-dot' + (i === 0 ? ' is-active' : '');
            btn.setAttribute('aria-label', 'Categoria ' + (i + 1));
            btn.addEventListener('click', () => {
                currentIndex = i;
                updateTrack();
                pauseAutoPlay();
            });
            dotsEl.appendChild(btn);
        }
    }

    function pauseAutoPlay() {
        autoPlayPausedUntil = Date.now() + 8000;
    }

    function startAutoPlay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            if (Date.now() < autoPlayPausedUntil) return;
            const maxIndex = getMaxIndex();
            if (maxIndex <= 0) return;
            if (currentIndex >= maxIndex) currentIndex = 0;
            else currentIndex += 1;
            updateTrack();
        }, 4000);
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex -= 1;
            updateTrack();
            pauseAutoPlay();
        }
    });
    nextBtn.addEventListener('click', () => {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex += 1;
            updateTrack();
            pauseAutoPlay();
        }
    });

    window.addEventListener('resize', () => {
        visibleCount = getVisibleCount();
        const newMax = getMaxIndex();
        if (currentIndex > newMax) currentIndex = newMax;
        buildDots();
        updateTrack();
    });

    buildDots();
    updateTrack();
    startAutoPlay();
}

function setupTestimonialSlider() {
    const slider = document.querySelector('.depoimentos-slider');
    if (!slider) return;
    const trackWrap = slider.querySelector('.depoimentos-track-wrap');
    const track = slider.querySelector('.depoimentos-track');
    const cards = slider.querySelectorAll('.depoimento-card');
    const prevBtn = slider.querySelector('.depoimentos-prev');
    const nextBtn = slider.querySelector('.depoimentos-next');
    const dotsEl = slider.querySelector('.depoimentos-dots');
    if (!trackWrap || !track || !cards.length || !dotsEl) return;

    const gapPx = 16;

    function getVisibleCount() {
        const w = window.innerWidth;
        if (w >= 1280) return 3;
        if (w >= 768) return 2;
        return 1;
    }

    let currentIndex = 0;
    let visibleCount = getVisibleCount();
    let autoPlayTimer = null;
    let autoPlayPausedUntil = 0;

    function getMaxIndex() {
        return Math.max(0, cards.length - getVisibleCount());
    }

    function updateTrack() {
        visibleCount = getVisibleCount();
        slider.setAttribute('data-visible', String(visibleCount));
        const maxIndex = getMaxIndex();
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        void trackWrap.offsetWidth;
        const cardWidth = cards[0] ? cards[0].offsetWidth : 0;
        const stepPx = cardWidth + gapPx;
        const offsetPx = currentIndex * stepPx;
        track.style.transform = `translateX(-${offsetPx}px)`;
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        dotsEl.querySelectorAll('.depoimentos-dot').forEach((dot, i) => {
            dot.classList.toggle('is-active', i === currentIndex);
        });
    }

    function buildDots() {
        dotsEl.innerHTML = '';
        const count = getMaxIndex() + 1;
        for (let i = 0; i < count; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'depoimentos-dot' + (i === 0 ? ' is-active' : '');
            btn.setAttribute('aria-label', 'Depoimento ' + (i + 1));
            btn.addEventListener('click', () => {
                currentIndex = i;
                updateTrack();
                pauseAutoPlay();
            });
            dotsEl.appendChild(btn);
        }
    }

    function pauseAutoPlay() {
        autoPlayPausedUntil = Date.now() + 8000;
    }

    function startAutoPlay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            if (Date.now() < autoPlayPausedUntil) return;
            const maxIndex = getMaxIndex();
            if (maxIndex <= 0) return;
            if (currentIndex >= maxIndex) currentIndex = 0;
            else currentIndex += 1;
            updateTrack();
        }, 4000);
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex -= 1;
            updateTrack();
            pauseAutoPlay();
        }
    });
    nextBtn.addEventListener('click', () => {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex += 1;
            updateTrack();
            pauseAutoPlay();
        }
    });

    window.addEventListener('resize', () => {
        const prevMax = getMaxIndex();
        visibleCount = getVisibleCount();
        const newMax = getMaxIndex();
        if (currentIndex > newMax) currentIndex = newMax;
        buildDots();
        updateTrack();
    });

    buildDots();
    updateTrack();
    startAutoPlay();
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(`
        .section-header,
        .sobre-bloco1,
        .sobre-musicos,
        .musician-card,
        .repertorio-slider,
        .videos-slider,
        .galeria-testimonials,
        .depoimentos-slider,
        .contato-info
    `);
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    } else {
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function trackEvent(eventName, eventData = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

document.addEventListener('click', (e) => {
    const btnPrimary = e.target.closest('.btn-primary');
    if (btnPrimary) {
        trackEvent('cta_click', {
            button_text: btnPrimary.textContent.trim(),
            section: getClosestSection(btnPrimary)
        });
    }
    const btnWhatsapp = e.target.closest('.btn-whatsapp');
    if (btnWhatsapp) {
        trackEvent('whatsapp_click', {
            button_text: btnWhatsapp.textContent.trim(),
            section: getClosestSection(btnWhatsapp)
        });
    }
});

function getClosestSection(element) {
    const section = element.closest('section');
    return section ? section.id || section.className : 'unknown';
}

window.addEventListener('error', (e) => {
    if (typeof Sentry !== 'undefined') {
        Sentry.captureException(e.error);
    }
});

window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        trackEvent('page_load_time', {
            load_time: loadTime,
            connection: navigator.connection?.effectiveType || 'unknown'
        });
    }
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => {})
            .catch(() => {});
    });
}

if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

window.LigatureApp = {
    trackEvent,
    debounce
};
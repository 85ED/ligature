// Aguardar carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Inicialização principal da aplicação
function initializeApp() {
    setupMobileMenu();
    setupSmoothScroll();
    setupHeaderScroll();
    setupGalleryModal();
    setupAudioPlayers();
    setupContactForm();
    setupScrollAnimations();
    updateCurrentYear();
    setupLazyLoading();
    
    console.log('🎵 Ligature - Site inicializado com sucesso!');
}

// Configuração do menu mobile
function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // Animação do ícone hambúrguer
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

    // Fechar menu ao clicar em um link
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

    // Fechar menu ao clicar fora
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

// Rolagem suave para âncoras
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

// Efeito do header no scroll
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

// Modal da galeria
function setupGalleryModal() {
    const modal = document.getElementById('modal-galeria');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.modal-close');
    const galleryItems = document.querySelectorAll('.galeria-item');

    if (!modal || !modalImg || !modalCaption || !closeModal) return;

    // Abrir modal
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.overlay-content h4');
            const location = this.querySelector('.overlay-content p');
            
            if (img && caption) {
                modal.style.display = 'block';
                modalImg.src = img.src;
                modalImg.alt = img.alt;
                modalCaption.innerHTML = `
                    <h4>${caption.textContent}</h4>
                    ${location ? `<p>${location.textContent}</p>` : ''}
                `;
                
                // Prevenir scroll do body
                document.body.style.overflow = 'hidden';
                
                // Animação de entrada
                setTimeout(() => {
                    modal.style.opacity = '1';
                }, 10);
            }
        });
    });

    // Fechar modal
    function closeModalFunction() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    closeModal.addEventListener('click', closeModalFunction);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunction();
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalFunction();
        }
    });
}

// Players de áudio (simulação)
function setupAudioPlayers() {
    const playButtons = document.querySelectorAll('.play-btn');
    let currentButton = null;
    let currentTimeout = null;

    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const genre = this.getAttribute('data-genre');
            
            // Parar reprodução atual se houver
            if (currentButton && currentButton !== this) {
                stopCurrentPlayback();
            }

            // Se clicou no mesmo botão que está tocando, parar
            if (currentButton === this && this.classList.contains('playing')) {
                stopCurrentPlayback();
                return;
            }

            // Iniciar nova reprodução
            startPlayback(this, genre);
        });
    });

    function startPlayback(button, genre) {
        button.classList.add('playing');
        button.innerHTML = '<span class="play-icon">⏸</span>Pausar';
        currentButton = button;
        
        // Simular duração de 30 segundos
        currentTimeout = setTimeout(() => {
            stopCurrentPlayback();
        }, 30000);
        
        // Feedback visual
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        console.log(`🎵 Reproduzindo demonstração: ${genre}`);
    }

    function stopCurrentPlayback() {
        if (currentButton) {
            currentButton.classList.remove('playing');
            currentButton.innerHTML = '<span class="play-icon">▶</span>Ouvir Demonstração';
            currentButton = null;
        }
        
        if (currentTimeout) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
        }
    }
}

// Formulário de contato
function setupContactForm() {
    const form = document.getElementById('form-contato');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter dados do formulário
        const formData = new FormData(form);
        const dados = {
            nome: formData.get('nome')?.trim(),
            telefone: formData.get('telefone')?.trim(),
            email: formData.get('email')?.trim(),
            evento: formData.get('evento'),
            data: formData.get('data'),
            mensagem: formData.get('mensagem')?.trim()
        };
        
        // Validação
        if (!validateForm(dados)) {
            return;
        }
        
        // Processar envio
        processFormSubmission(dados);
    });
}

// Validação do formulário
function validateForm(dados) {
    // Limpar mensagens anteriores
    clearFormMessages();
    
    // Campos obrigatórios
    if (!dados.nome || !dados.telefone || !dados.email || !dados.evento) {
        showFormMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
        return false;
    }
    
    // Validar email
    if (!isValidEmail(dados.email)) {
        showFormMessage('Por favor, insira um endereço de email válido.', 'error');
        return false;
    }
    
    // Validar telefone (básico)
    if (!isValidPhone(dados.telefone)) {
        showFormMessage('Por favor, insira um número de telefone válido.', 'error');
        return false;
    }
    
    return true;
}

// Validação de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validação de telefone
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\(\)\-\+]{10,}$/;
    return phoneRegex.test(phone);
}

// Processar envio do formulário
function processFormSubmission(dados) {
    const form = document.getElementById('form-contato');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Estado de loading
    form.classList.add('form-loading');
    submitButton.textContent = 'Enviando...';
    
    // Simular delay de envio
    setTimeout(() => {
        // Remover loading
        form.classList.remove('form-loading');
        submitButton.textContent = 'Enviar Mensagem';
        
        // Limpar formulário
        form.reset();
        
        // Mostrar sucesso
        showFormMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Redirecionar para WhatsApp
        setTimeout(() => {
            const whatsappMessage = createWhatsAppMessage(dados);
            const whatsappURL = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappURL, '_blank');
        }, 1500);
        
        // Analytics
        trackEvent('form_submission', {
            event_type: dados.evento,
            has_date: !!dados.data,
            has_message: !!dados.mensagem
        });
        
    }, 2000);
}

// Criar mensagem para WhatsApp
function createWhatsAppMessage(dados) {
    let mensagem = `🎵 *Ligature - Solicitação de Orçamento*\n\n`;
    mensagem += `📋 *Dados do Contato:*\n`;
    mensagem += `Nome: ${dados.nome}\n`;
    mensagem += `Telefone: ${dados.telefone}\n`;
    mensagem += `Email: ${dados.email}\n`;
    mensagem += `Tipo de Evento: ${getEventTypeName(dados.evento)}\n`;
    
    if (dados.data) {
        mensagem += `Data: ${formatDate(dados.data)}\n`;
    }
    
    if (dados.mensagem) {
        mensagem += `\n💬 *Mensagem:*\n${dados.mensagem}\n`;
    }
    
    mensagem += `\n✨ Aguardo retorno para conversarmos sobre os detalhes!`;
    
    return mensagem;
}

// Obter nome do tipo de evento
function getEventTypeName(tipo) {
    const tipos = {
        'casamento': 'Casamento',
        'pedido': 'Pedido de Casamento',
        'aniversario': 'Aniversário',
        'corporativo': 'Evento Corporativo',
        'religioso': 'Evento Religioso',
        'outro': 'Outro'
    };
    return tipos[tipo] || tipo;
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Mostrar mensagem do formulário
function showFormMessage(message, type) {
    clearFormMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-${type}`;
    messageDiv.textContent = message;
    
    const form = document.getElementById('form-contato');
    form.appendChild(messageDiv);
    
    // Scroll para a mensagem
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Remover mensagem após 8 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 8000);
}

// Limpar mensagens do formulário
function clearFormMessages() {
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
}

// Animações no scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target); // Animar apenas uma vez
            }
        });
    }, observerOptions);

    // Elementos para animar
    const elementsToAnimate = document.querySelectorAll(`
        .section-header,
        .sobre-text,
        .sobre-image,
        .repertorio-card,
        .galeria-item,
        .depoimento-card,
        .contato-form,
        .contato-info
    `);
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Lazy loading para imagens
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
        // Fallback para navegadores sem suporte
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Atualizar ano atual
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Função debounce para otimização
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

// Tracking de eventos (Analytics)
function trackEvent(eventName, eventData = {}) {
    // Integração com Google Analytics, Facebook Pixel, etc.
    console.log('📊 Event tracked:', eventName, eventData);
    
    // Exemplo de integração com Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Event listeners globais
document.addEventListener('click', (e) => {
    // Track clicks em botões importantes
    if (e.target.matches('.btn-primary')) {
        trackEvent('cta_click', {
            button_text: e.target.textContent.trim(),
            section: getClosestSection(e.target)
        });
    }
    
    if (e.target.matches('.btn-whatsapp')) {
        trackEvent('whatsapp_click', {
            button_text: e.target.textContent.trim(),
            section: getClosestSection(e.target)
        });
    }
    
    if (e.target.matches('.play-btn')) {
        trackEvent('audio_play', {
            genre: e.target.getAttribute('data-genre')
        });
    }
});

// Obter seção mais próxima
function getClosestSection(element) {
    const section = element.closest('section');
    return section ? section.id || section.className : 'unknown';
}

// Tratamento de erros global
window.addEventListener('error', (e) => {
    console.error('❌ Erro capturado:', e.error);
    
    // Enviar erro para serviço de monitoramento (ex: Sentry)
    if (typeof Sentry !== 'undefined') {
        Sentry.captureException(e.error);
    }
});

// Monitoramento de performance
window.addEventListener('load', () => {
    // Métricas de performance
    if ('performance' in window) {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        console.log(`⚡ Site carregado em ${loadTime}ms`);
        
        // Track performance
        trackEvent('page_load_time', {
            load_time: loadTime,
            connection: navigator.connection?.effectiveType || 'unknown'
        });
    }
    
    // Remover preloader se existir
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
});

// Service Worker para cache (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('🔧 Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('❌ Falha ao registrar Service Worker:', error);
            });
    });
}

// Detectar modo escuro do sistema
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    console.log('🌙 Modo escuro detectado');
    // Implementar tema escuro se necessário
}

// Detectar preferência de movimento reduzido
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('♿ Movimento reduzido preferido');
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

// Log de inicialização
console.log(`
🎵 Ligature - Edson & Daniela
📧 Contato: contato@ligature.com.br
📱 WhatsApp: (11) 99999-9999
✨ Site desenvolvido com amor e música!
`);

// Exportar funções para uso global se necessário
window.LigatureApp = {
    trackEvent,
    showFormMessage,
    debounce
};
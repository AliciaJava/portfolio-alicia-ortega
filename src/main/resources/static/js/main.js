/**
 * Portfolio Alicia Ortega - Main JavaScript
 * 
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ===== 1. NAVEGACIÓN MÓVIL =====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    if (hamburger && navLinks) {
        // Toggle menú
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
            hamburger.classList.toggle('is-active', isOpen);
            
            // Bloquear scroll cuando menú está abierto (móvil)
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Cerrar al hacer click en links
        navItems.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Cerrar al hacer click fuera del menú
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !hamburger.contains(e.target)) {
                closeMenu();
            }
        });

        // Cerrar con tecla ESC (accesibilidad)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    function closeMenu() {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    // ===== 2. SCROLL SUAVE CON OFFSET =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== 3. NAVBAR SCROLL EFFECT (Con debounce) =====
    let ticking = false;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 50) {
                        navbar.classList.add('scrolled');
                        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                    } else {
                        navbar.classList.remove('scrolled');
                        navbar.style.boxShadow = 'none';
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ===== 4. ANIMACIONES AL SCROLL (Intersection Observer) =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Delay escalonado para efecto "cascada"
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleccionar elementos a animar
    const animatedElements = document.querySelectorAll('.project-card, .tech-category, .community-card, .stat-card');
    
    animatedElements.forEach(el => {
        // Estado inicial vía clase (no inline styles para mejor maintainability)
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // ===== 5. CONTADORES ANIMADOS (Stats) =====
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing ease-out
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // ===== 6. VALIDACIONES Y SEGURIDAD =====
    
    // Añadir rel="noopener" a enlaces externos automáticamente
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        if (!link.rel || !link.rel.includes('noopener')) {
            link.rel = (link.rel || '') + ' noopener noreferrer';
        }
    });

    // Manejar imágenes rotas
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.warn(`Imagen no encontrada: ${this.src}`);
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%2316213e" width="400" height="300"/%3E%3Ctext fill="%23f89820" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
            this.alt = 'Imagen no disponible';
        });
    });

});
// ===== Nord Bois Structure - Main JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // ===== Mobile Navigation =====
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    const openMenu = () => navMenu.classList.add('active');
    const closeMenu = () => navMenu.classList.remove('active');

    navToggle?.addEventListener('click', openMenu);
    navClose?.addEventListener('click', closeMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // ===== Header Scroll Effect =====
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ===== Active Navigation Link =====
    const sections = document.querySelectorAll('section[id]');

    const highlightNavLink = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Scroll Animations (Intersection Observer) =====
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Add fade-in class to elements
    const animateElements = document.querySelectorAll(
        '.service-card, .about__value, .commitment, .testimonial, .gallery__item, .contact__card'
    );

    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index % 4 * 0.1}s`;
        observer.observe(el);
    });

    // ===== Gallery Filter =====
    const filterButtons = document.querySelectorAll('.gallery__filter');
    const galleryItems = document.querySelectorAll('.gallery__item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter items
            const filter = button.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });

    // ===== Lightbox =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox?.querySelector('.lightbox__img');
    const lightboxClose = lightbox?.querySelector('.lightbox__close');
    const lightboxPrev = lightbox?.querySelector('.lightbox__prev');
    const lightboxNext = lightbox?.querySelector('.lightbox__next');
    let currentImageIndex = 0;
    let galleryImages = [];

    // Collect gallery images
    galleryItems.forEach((item, index) => {
        const placeholder = item.querySelector('.gallery__placeholder');
        if (placeholder) {
            galleryImages.push({
                index: index,
                title: item.querySelector('h3')?.textContent || ''
            });
        }

        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox();
        });
    });

    const openLightbox = () => {
        if (lightbox) {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateLightboxImage();
        }
    };

    const closeLightbox = () => {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    const updateLightboxImage = () => {
        // For demo, we'll show a placeholder
        if (lightboxImg) {
            lightboxImg.alt = galleryImages[currentImageIndex]?.title || 'Image';
        }
    };

    const nextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateLightboxImage();
    };

    const prevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxImage();
    };

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxNext?.addEventListener('click', nextImage);
    lightboxPrev?.addEventListener('click', prevImage);

    // Close lightbox on background click
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // ===== Contact Form =====
    const contactForm = document.getElementById('contact-form');

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.name || !data.email || !data.project || !data.message) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Envoi en cours...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            showNotification('Merci ! Votre demande a bien été envoyée. Nous vous répondrons sous 24h.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    // ===== Notification System =====
    const showNotification = (message, type = 'success') => {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification__close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#2D5A3D' : '#dc3545'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;

        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Close button
        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    };

    // ===== Counter Animation =====
    const animateCounters = () => {
        const counters = document.querySelectorAll('.hero__stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const suffix = counter.textContent.replace(/[0-9]/g, '');
            let current = 0;
            const increment = target / 50;
            const duration = 2000;
            const stepTime = duration / 50;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + suffix;
                    setTimeout(updateCounter, stepTime);
                } else {
                    counter.textContent = target + suffix;
                }
            };

            // Start animation when hero is visible
            const heroObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    heroObserver.disconnect();
                }
            }, { threshold: 0.5 });

            heroObserver.observe(document.querySelector('.hero'));
        });
    };

    animateCounters();

    // ===== Parallax Effect on Hero =====
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 768) {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero__content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        }
    });

    // ===== Floating CTA visibility =====
    const floatingCta = document.querySelector('.floating-cta');
    const contactSection = document.getElementById('contact');

    if (floatingCta && contactSection) {
        window.addEventListener('scroll', () => {
            const contactRect = contactSection.getBoundingClientRect();
            if (contactRect.top < window.innerHeight) {
                floatingCta.style.opacity = '0';
                floatingCta.style.pointerEvents = 'none';
            } else {
                floatingCta.style.opacity = '1';
                floatingCta.style.pointerEvents = 'auto';
            }
        });
    }

    console.log('Nord Bois Structure - Site loaded successfully');
});

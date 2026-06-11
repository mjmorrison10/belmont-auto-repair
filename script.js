// Belmont Auto Repair - Interactive Scripts

(function() {
    'use strict';

    // ============================================
    // MOBILE MENU TOGGLE (smooth max-height transition)
    // ============================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    const backToTop = document.getElementById('backToTop');

    function toggleBackToTop() {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // ANIMATED COUNTER (IntersectionObserver)
    // ============================================
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;

        const duration = 2000;
        const startTime = performance.now();
        const originalText = el.textContent;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            // Preserve "+" suffix if original had it
            if (originalText.includes('+')) {
                el.textContent = current.toLocaleString() + '+';
            } else {
                el.textContent = current.toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Observer for stats numbers
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stats-number[data-count]').forEach(el => {
        statsObserver.observe(el);
    });

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .review-card, .why-feature, .detail-card, .proof-card, .trust-strip-badge').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // STAGGERED ANIMATIONS
    // ============================================
    function applyStaggeredDelays(selector, baseDelay) {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.style.animationDelay = (index * baseDelay) + 's';
        });
    }

    applyStaggeredDelays('.service-card', 0.1);
    applyStaggeredDelays('.review-card', 0.1);
    applyStaggeredDelays('.why-feature', 0.15);
    applyStaggeredDelays('.detail-card', 0.15);
    applyStaggeredDelays('.proof-card', 0.1);
    applyStaggeredDelays('.trust-strip-badge', 0.1);

    // ============================================
    // PARALLAX HERO (subtle)
    // ============================================
    const heroContent = document.querySelector('.hero-content');
    const hero = document.querySelector('.hero');

    if (heroContent && hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroHeight = hero.offsetHeight;
            if (scrolled < heroHeight) {
                const parallaxOffset = scrolled * 0.3;
                heroContent.style.transform = 'translateY(' + parallaxOffset + 'px)';
                heroContent.style.opacity = 1 - (scrolled / heroHeight) * 0.5;
            }
        }, { passive: true });
    }

    // ============================================
    // HERO PARTICLES
    // ============================================
    const heroParticles = document.getElementById('heroParticles');

    if (heroParticles) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = (Math.random() * 6) + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            particle.style.width = (2 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            heroParticles.appendChild(particle);
        }
    }

    // ============================================
    // CTA PULSE (auto-add after 3 seconds)
    // ============================================
    setTimeout(() => {
        const heroCallBtn = document.getElementById('heroCallBtn');
        if (heroCallBtn && !heroCallBtn.classList.contains('btn-pulse')) {
            heroCallBtn.classList.add('btn-pulse');
        }
    }, 3000);

    // ============================================
    // ACTIVE NAV HIGHLIGHTING (scroll-based)
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a[data-section]');

    function highlightActiveNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('nav-active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    // ============================================
    // "EST. 1970s" ANIMATION IN LOGO
    // ============================================
    const logoEst = document.querySelector('.logo-est');

    if (logoEst) {
        setTimeout(() => {
            logoEst.classList.add('animate-est');
        }, 1500);
    }

    // ============================================
    // OPEN/CLOSED INDICATOR
    // ============================================
    function updateOpenStatus() {
        const statusEl = document.getElementById('openStatus');
        if (!statusEl) return;
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        let isOpen = false;
        if (day === 1 && hour >= 8 && hour < 16) isOpen = true;
        if (day >= 2 && day <= 5 && hour >= 8 && hour < 17) isOpen = true;

        if (isOpen) {
            statusEl.innerHTML = '<span style="color: #10b981; font-weight: 700;">OPEN NOW</span> Mon: 8AM-4PM | Tue-Fri: 8AM-5PM';
        } else {
            statusEl.innerHTML = '<span style="color: #ef4444; font-weight: 700;">CLOSED</span> Mon: 8AM-4PM | Tue-Fri: 8AM-5PM';
        }

        // Also update contact form hours indicator
        const contactOpenStatus = document.getElementById('contactOpenStatus');
        if (contactOpenStatus) {
            if (isOpen) {
                contactOpenStatus.innerHTML = '<span style="color: #10b981;">OPEN NOW</span> - We\'ll call you back within 1 hour';
            } else {
                contactOpenStatus.innerHTML = '<span style="color: #ef4444;">Currently CLOSED</span> - We\'ll call you on our next business day';
            }
        }

        // Also update mobile hours
        const mobileHours = document.getElementById('mobileHours');
        if (mobileHours) {
            if (isOpen) {
                mobileHours.innerHTML = '<span style="color: #10b981; font-weight: 700;">OPEN</span> until ' + (day === 1 ? '4PM' : '5PM');
            } else {
                mobileHours.textContent = 'Opens Mon 8AM';
            }
        }
    }
    updateOpenStatus();
    setInterval(updateOpenStatus, 60000);

    // ============================================
    // FORM VALIDATION (real-time)
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');

    function validateName() {
        const value = nameInput.value.trim();
        if (!value) {
            nameInput.classList.remove('valid');
            nameInput.classList.add('invalid');
            nameError.textContent = 'Name is required';
            return false;
        } else if (value.length < 2) {
            nameInput.classList.remove('valid');
            nameInput.classList.add('invalid');
            nameError.textContent = 'Name must be at least 2 characters';
            return false;
        }
        nameInput.classList.remove('invalid');
        nameInput.classList.add('valid');
        nameError.textContent = '';
        return true;
    }

    function validatePhone() {
        const value = phoneInput.value.trim();
        const phoneRegex = /^[\d\s\-\(\)\+]{7,}$/;
        if (!value) {
            phoneInput.classList.remove('valid');
            phoneInput.classList.add('invalid');
            phoneError.textContent = 'Phone number is required';
            return false;
        } else if (!phoneRegex.test(value)) {
            phoneInput.classList.remove('valid');
            nameInput.classList.remove('valid');
            phoneInput.classList.add('invalid');
            phoneError.textContent = 'Enter a valid phone number';
            return false;
        }
        phoneInput.classList.remove('invalid');
        phoneInput.classList.add('valid');
        phoneError.textContent = '';
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        // Email is optional
        if (!value) {
            emailInput.classList.remove('invalid', 'valid');
            emailError.textContent = '';
            return true;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            emailInput.classList.remove('valid');
            emailInput.classList.add('invalid');
            emailError.textContent = 'Enter a valid email address';
            return false;
        }
        emailInput.classList.remove('invalid');
        emailInput.classList.add('valid');
        emailError.textContent = '';
        return true;
    }

    // Real-time validation on blur/input
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', function() {
        if (this.classList.contains('invalid')) validateName();
    });

    phoneInput.addEventListener('blur', validatePhone);
    phoneInput.addEventListener('input', function() {
        if (this.classList.contains('invalid')) validatePhone();
    });

    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', function() {
        if (this.classList.contains('invalid')) validateEmail();
    });

    // Form submit handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isEmailValid = validateEmail();

        if (!isNameValid || !isPhoneValid || !isEmailValid) return;

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        const subject = encodeURIComponent('Appointment Request - ' + (data.make || 'Vehicle') + ' ' + (data.year || ''));
        const body = encodeURIComponent(
            'Name: ' + data.name + '\nPhone: ' + data.phone + '\nEmail: ' + (data.email || 'N/A') + '\n' +
            'Vehicle: ' + (data.make || 'N/A') + ' ' + (data.year || '') + '\nService: ' + (data.service || 'N/A') + '\n' +
            'Issue: ' + (data.message || 'N/A') + '\n\nPlease call me to schedule an appointment.'
        );
        window.location.href = 'mailto:info@belmontautorepair.com?subject=' + subject + '&body=' + body;

        // Fallback if email client doesn't open
        setTimeout(() => {
            if (!document.hidden) {
                const formNote = document.querySelector('.form-note');
                if (formNote) {
                    const originalNote = formNote.textContent;
                    formNote.innerHTML = 'Email didn\'t open? Call us directly at <a href="tel:5624390291" style="color: var(--primary); font-weight: 700;">(562) 439-0291</a>';
                    setTimeout(() => {
                        formNote.textContent = originalNote;
                    }, 8000);
                }
            }
        }, 2000);

        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '&#10003; Request Sent!';
        btn.style.background = '#10b981';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#fff';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            this.reset();
            // Clear validation styles
            nameInput.classList.remove('valid', 'invalid');
            phoneInput.classList.remove('valid', 'invalid');
            emailInput.classList.remove('valid', 'invalid');
            nameError.textContent = '';
            phoneError.textContent = '';
            emailError.textContent = '';
        }, 3000);
    });

    // ============================================
    // CLICK-TO-CALL TRACKING WITH LOCATION
    // ============================================
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            let location = 'unknown';
            if (link.closest('.hero')) location = 'hero';
            else if (link.closest('.urgency-banner')) location = 'urgency-banner';
            else if (link.closest('.featured-testimonial')) location = 'featured-testimonial';
            else if (link.closest('.cta-section')) location = 'cta-section';
            else if (link.closest('.mobile-cta')) location = 'mobile-cta';
            else if (link.closest('.contact')) location = 'contact-section';
            else if (link.closest('.footer')) location = 'footer';

            if (typeof gtag === 'function') {
                gtag('event', 'click_to_call', { business: 'Belmont Auto Repair', click_location: location });
            }
        });
    });

})();

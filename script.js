/* ============================================
   BELMONT AUTO REPAIR — "THE HERITAGE SHOP"
   Interactive JavaScript
   ============================================ */

(function () {
  'use strict';

  // ---- DOM Elements ----
  const header = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const openIndicator = document.getElementById('openIndicator');
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formFallback = document.getElementById('formFallback');
  const currentYear = document.getElementById('currentYear');

  // ---- Set Current Year ----
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ---- Scroll Progress Bar ----
  function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrollPercent + '%';
  }

  // ---- Header Scroll Effect ----
  let lastScrollY = 0;

  function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = scrollTop;
  }

  // ---- Back to Top Button ----
  function updateBackToTop() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Scroll Event (Throttled) ----
  let scrollTicking = false;

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        updateScrollProgress();
        updateHeader();
        updateBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ---- Hamburger Menu ----
  function toggleMobileMenu() {
    const isActive = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
    mobileMenu.setAttribute('aria-hidden', !isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu on link click
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ---- IntersectionObserver for Animations ----
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const animationObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger animation for siblings
          const parent = entry.target.parentElement;
          const siblings = parent.querySelectorAll('.animate-on-scroll');
          let index = Array.from(siblings).indexOf(entry.target);

          setTimeout(
            function () {
              entry.target.classList.add('is-visible');
            },
            index * 100
          );

          animationObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  animatedElements.forEach(function (el) {
    animationObserver.observe(el);
  });

  // ---- Open/Closed Indicator ----
  function updateOpenStatus() {
    if (!openIndicator) return;

    const now = new Date();
    // Convert to Pacific Time
    const pacificOptions = { timeZone: 'America/Los_Angeles' };
    const dayStr = now.toLocaleDateString('en-US', { weekday: 'long', ...pacificOptions });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, ...pacificOptions });
    const currentHour = parseInt(timeStr.split(':')[0], 10);
    const currentMinute = parseInt(timeStr.split(':')[1], 10);
    const currentTime = currentHour * 60 + currentMinute;

    let isOpen = false;

    // Monday: 8AM - 4PM (8:00 - 16:00)
    if (dayStr === 'Monday') {
      isOpen = currentTime >= 480 && currentTime < 960;
    }
    // Tuesday - Friday: 8AM - 5PM (8:00 - 17:00)
    else if (['Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(dayStr)) {
      isOpen = currentTime >= 480 && currentTime < 1020;
    }
    // Saturday - Sunday: Closed
    else {
      isOpen = false;
    }

    const dotEl = openIndicator.querySelector('.open-dot');
    const textEl = openIndicator.querySelector('.open-text');

    if (isOpen) {
      openIndicator.classList.remove('closed');
      textEl.textContent = 'Open Now';
    } else {
      openIndicator.classList.add('closed');
      textEl.textContent = 'Closed';
    }
  }

  // Update immediately and then every 60 seconds
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);

  // ---- Contact Form Handling ----
  function validateForm() {
    let isValid = true;
    const fullName = document.getElementById('fullName');
    const phone = document.getElementById('phone');

    // Clear previous errors
    document.querySelectorAll('.error').forEach(function (el) {
      el.classList.remove('error');
    });

    if (!fullName.value.trim()) {
      fullName.classList.add('error');
      isValid = false;
    }

    if (!phone.value.trim()) {
      phone.classList.add('error');
      isValid = false;
    }

    return isValid;
  }

  function buildMailtoLink() {
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const vehicleMake = document.getElementById('vehicleMake').value.trim();
    const year = document.getElementById('year').value.trim();
    const serviceNeeded = document.getElementById('serviceNeeded').value;
    const issue = document.getElementById('issue').value.trim();

    const subject = encodeURIComponent('Appointment Request from ' + fullName);
    const body = encodeURIComponent(
      'Name: ' + fullName + '\n' +
      'Phone: ' + phone + '\n' +
      'Email: ' + (email || 'N/A') + '\n' +
      'Vehicle: ' + (vehicleMake || 'N/A') + ' ' + (year || '') + '\n' +
      'Service: ' + (serviceNeeded || 'Not specified') + '\n' +
      'Issue: ' + (issue || 'Not described') + '\n\n' +
      'Sent from belmontautorepair.com'
    );

    return 'mailto:info@belmontautorepair.com?subject=' + subject + '&body=' + body;
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Show loading state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;

    // Open mailto link
    const mailtoLink = buildMailtoLink();

    // Set a 2-second fallback to show phone number
    const fallbackTimer = setTimeout(function () {
      formFallback.style.display = 'block';
    }, 2000);

    // Open mail client
    window.location.href = mailtoLink;

    // Reset button after a delay
    setTimeout(function () {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
      clearTimeout(fallbackTimer);
    }, 3000);
  });

  // ---- Active Nav Highlighting ----
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNav() {
    const scrollPos = window.pageYOffset + header.offsetHeight + 100;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      // Check if section has a nav link
      const navLink = document.querySelector('.nav-list a[href="#' + id + '"]');
      if (!navLink) return;

      if (scrollPos >= top && scrollPos < top + height) {
        navLink.style.color = '#d97706';
      } else {
        navLink.style.color = '';
      }
    });
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        highlightActiveNav();
      });
    }
  }, { passive: true });

  // ---- Lazy Load Google Maps ----
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer) {
    const mapObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const iframe = mapContainer.querySelector('iframe');
            if (iframe && iframe.dataset.src) {
              iframe.src = iframe.dataset.src;
            }
            mapObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    mapObserver.observe(mapContainer);
  }

  // ---- Initialize on Load ----
  updateScrollProgress();
  updateHeader();
  updateBackToTop();
  highlightActiveNav();
})();

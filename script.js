document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!expanded));
            navMenu.classList.toggle('open');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navMenu?.classList.remove('open');
            menuToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    const sections = document.querySelectorAll('section[id]');

    const splitToLetters = element => {
        if (!element || element.dataset.lettersReady === 'true') return;
        const text = element.textContent;
        if (!text || !text.trim()) return;

        element.dataset.lettersReady = 'true';
        element.setAttribute('aria-label', text.trim());
        element.classList.add('scroll-text-reveal');
        const words = text.split(' ');
        let letterIndex = 0;
        element.innerHTML = words
            .map((word, wordIndex) => {
                const wordChars = word
                    .split('')
                    .map(char => {
                        const span = `<span class="headline-letter" style="animation-delay:${letterIndex * 0.02}s">${char}</span>`;
                        letterIndex += 1;
                        return span;
                    })
                    .join('');

                const spacer = wordIndex < words.length - 1
                    ? `<span class="letter-space" style="animation-delay:${letterIndex * 0.02}s">&nbsp;</span>`
                    : '';

                if (wordIndex < words.length - 1) letterIndex += 1;
                return `<span class="letter-word">${wordChars}</span>${spacer}`;
            })
            .join('');
    };

    const playLetterAnimation = element => {
        const letters = element.querySelectorAll('.headline-letter');
        letters.forEach(letter => {
            letter.classList.remove('play');
            void letter.offsetWidth;
            letter.classList.add('play');
        });
    };

    const scrollTextTargets = Array.from(document.querySelectorAll('section h1, section h2, section h3, section h4, section p, section li'))
        .filter(el => !el.closest('.contact-form'))
        .filter(el => el.children.length === 0)
        .filter(el => {
            // Only animate the Welcome title (h1) in the about section
            if (el.closest('#about') && el.tagName === 'H1' && el.textContent.includes('Welcome')) {
                return true;
            }
            return false;
        });

    scrollTextTargets.forEach(splitToLetters);

    const textObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                playLetterAnimation(entry.target);
            } else {
                entry.target.querySelectorAll('.headline-letter').forEach(letter => {
                    letter.classList.remove('play');
                });
            }
        });
    }, { threshold: 0.35 });

    scrollTextTargets.forEach(el => textObserver.observe(el));
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        });
    }, { threshold: 0.45 });

    sections.forEach(section => sectionObserver.observe(section));

    // Only animate hero-animate elements in the about section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.querySelectorAll('.hero-animate').forEach(el => {
            el.classList.add('in');
        });
    }

    const animatedItems = document.querySelectorAll('[data-animate]');
    
    // Add in-view class immediately to all items (no animation on scroll)
    animatedItems.forEach(item => {
        item.classList.add('in-view');
    });
    
    // Keep revealObserver for reference but it won't do anything
    const revealObserver = new IntersectionObserver(entries => {
        // Animation disabled - keep items visible at all times
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    animatedItems.forEach(item => revealObserver.observe(item));

    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item[data-category]');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selected = btn.dataset.filter;
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            portfolioItems.forEach(item => {
                const categories = item.dataset.category.split(' ');
                const shouldShow = selected === 'all' || categories.includes(selected);
                item.classList.toggle('is-hidden', !shouldShow);
            });
        });
    });

    document.querySelectorAll('.dropdown-toggle').forEach(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            const dropdownImages = button.closest('.dropdown-item')?.querySelector('.dropdown-images');
            if (!dropdownImages) return;
            dropdownImages.classList.toggle('open');
            button.textContent = dropdownImages.classList.contains('open') ? 'Hide Images' : 'View More';
        });
    });

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close');
    const nextBtn = document.querySelector('.modal-nav.next');
    const prevBtn = document.querySelector('.modal-nav.prev');
    const lightboxImages = Array.from(document.querySelectorAll('.lightbox-trigger'));
    let currentIndex = 0;

    const openModal = index => {
        currentIndex = index;
        modalImg.src = lightboxImages[currentIndex].dataset.full || lightboxImages[currentIndex].src;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const stepModal = delta => {
        currentIndex = (currentIndex + delta + lightboxImages.length) % lightboxImages.length;
        modalImg.src = lightboxImages[currentIndex].dataset.full || lightboxImages[currentIndex].src;
    };

    lightboxImages.forEach((img, index) => {
        img.addEventListener('click', e => {
            e.preventDefault();
            openModal(index);
        });
    });

    document.querySelectorAll('.portfolio-item').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('button, a, video')) return;
            const trigger = card.querySelector('.lightbox-trigger');
            if (!trigger) return;
            const index = lightboxImages.indexOf(trigger);
            if (index >= 0) openModal(index);
        });
    });

    closeBtn?.addEventListener('click', closeModal);
    nextBtn?.addEventListener('click', () => stepModal(1));
    prevBtn?.addEventListener('click', () => stepModal(-1));

    modal?.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', e => {
        if (!modal?.classList.contains('show')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') stepModal(1);
        if (e.key === 'ArrowLeft') stepModal(-1);
    });

    const scrollTopButton = document.getElementById('scrollToTop');
    const toggleScrollButton = () => {
        if (!scrollTopButton) return;
        scrollTopButton.classList.toggle('show', window.scrollY > 420);
    };

    window.addEventListener('scroll', toggleScrollButton);
    toggleScrollButton();

    scrollTopButton?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const trailCards = document.querySelectorAll('.portfolio-item, .experience-card, .organization-card, .project-card, .article-card, .contact-item');
    // Remove motion trail effects - keep everything static
    trailCards.forEach(card => card.classList.remove('motion-trail'));

    // Disable scroll animation entirely
    const applyTrail = () => {};

    window.addEventListener('scroll', applyTrail, { passive: true });

    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', e => {
        e.preventDefault();
        const name = contactForm.querySelector('input[name="name"]').value.trim();
        const email = contactForm.querySelector('input[name="email"]').value.trim();
        const message = contactForm.querySelector('textarea[name="message"]').value.trim();

        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:camp.sean.14@gmail.com?subject=${subject}&body=${body}`;
        contactForm.reset();
    });
});

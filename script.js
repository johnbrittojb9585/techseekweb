// ==================== Mobile Menu Toggle ====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');

        const href = link.getAttribute('href') || '';
        if (href.startsWith('#')) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// ==================== Smooth Scrolling & Active Link ====================
window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) return;

        link.classList.remove('active');
        if (href.slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ==================== CTA Buttons ====================
const ctaButtons = document.querySelectorAll('.cta-button, .cta-button-white');

ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href !== '#contact' && href !== 'index.html#contact') {
            return;
        }

        // Find the contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            e.preventDefault();
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== Contact Form Handling ====================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const service = this.querySelector('select').value;
        const message = this.querySelector('textarea').value;
        const submitButton = this.querySelector('button[type="submit"]');

        // Validate form
        if (!name || !email || !service || !message) {
            showNotification('Please fill out all fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }

        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            const formData = new FormData(this);
            formData.set('service', this.querySelector('select').selectedOptions[0]?.text || service);

            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            showNotification('Message sent. Please check info@techseek.in for the submission or activation email.', 'success');
            this.reset();
            const customValue = this.querySelector('.custom-select-value');
            const firstOption = this.querySelector('select option');
            if (customValue && firstOption) customValue.textContent = firstOption.textContent;
            this.querySelectorAll('.custom-select-option').forEach((option, index) => {
                option.classList.toggle('selected', index === 0);
                option.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            });
        } catch (error) {
            showNotification('Message could not be sent. Please email info@techseek.in directly.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (!email) {
            showNotification('Please enter your email', 'error');
            return;
        }

        showNotification('Thank you for subscribing!', 'success');
        this.reset();
    });
}

// ==================== Custom Designed Dropdowns ====================
function initCustomSelects() {
    const selects = document.querySelectorAll('.contact-form select, .hero-field select');

    selects.forEach(select => {
        if (select.dataset.enhanced === 'true') return;
        select.dataset.enhanced = 'true';

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'custom-select-trigger';
        button.setAttribute('aria-haspopup', 'listbox');
        button.setAttribute('aria-expanded', 'false');

        const value = document.createElement('span');
        value.className = 'custom-select-value';
        value.textContent = select.options[select.selectedIndex]?.text || select.options[0]?.text || 'Select';

        const icon = document.createElement('i');
        icon.className = 'fas fa-chevron-down';
        icon.setAttribute('aria-hidden', 'true');

        button.append(value, icon);

        const menu = document.createElement('div');
        menu.className = 'custom-select-menu';
        menu.setAttribute('role', 'listbox');

        Array.from(select.options).forEach((option, index) => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'custom-select-option';
            item.setAttribute('role', 'option');
            item.dataset.value = option.value;
            item.innerHTML = `
                <span class="option-icon"><i class="fas fa-${index === 0 ? 'layer-group' : index === 1 ? 'building' : index === 2 ? 'mobile-alt' : index === 3 ? 'gamepad' : 'cloud'}"></i></span>
                <span>${option.text}</span>
            `;

            if (option.selected) {
                item.classList.add('selected');
                item.setAttribute('aria-selected', 'true');
            }

            item.addEventListener('click', () => {
                select.value = option.value;
                value.textContent = option.text;
                menu.querySelectorAll('.custom-select-option').forEach(optionButton => {
                    optionButton.classList.remove('selected');
                    optionButton.setAttribute('aria-selected', 'false');
                });
                item.classList.add('selected');
                item.setAttribute('aria-selected', 'true');
                wrapper.classList.remove('open');
                button.setAttribute('aria-expanded', 'false');
                select.dispatchEvent(new Event('change', { bubbles: true }));
            });

            menu.appendChild(item);
        });

        button.addEventListener('click', () => {
            document.querySelectorAll('.custom-select.open').forEach(openSelect => {
                if (openSelect !== wrapper) {
                    openSelect.classList.remove('open');
                    openSelect.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
                }
            });

            const isOpen = wrapper.classList.toggle('open');
            button.setAttribute('aria-expanded', String(isOpen));
        });

        select.classList.add('native-select-hidden');
        select.parentNode.insertBefore(wrapper, select.nextSibling);
        wrapper.append(button, menu);
    });

    document.addEventListener('click', event => {
        if (event.target.closest('.custom-select')) return;

        document.querySelectorAll('.custom-select.open').forEach(wrapper => {
            wrapper.classList.remove('open');
            wrapper.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
        });
    });
}

initCustomSelects();

// ==================== Notification System ====================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ==================== Intersection Observer for Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all service cards and portfolio items
document.querySelectorAll('.service-card, .portfolio-item, .stat').forEach(element => {
    observer.observe(element);
});

// ==================== Service Card Hover Effects ====================
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ==================== Scroll to Top Button ====================
function createScrollToTopButton() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #d00000;
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 12px 30px rgba(208, 0, 0, 0.25);
        z-index: 999;
        transition: all 0.3s ease;
        font-size: 1.2rem;
    `;

    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });

    scrollTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}

createScrollToTopButton();

// ==================== AI Hero Canvas Animation ====================
function initAiHeroCanvas() {
    const canvas = document.getElementById('aiHeroCanvas');
    const hero = document.querySelector('.hero');
    if (!canvas || !hero) return;

    const context = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let points = [];
    let animationFrame = null;

    function resizeCanvas() {
        const rect = hero.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        width = Math.max(rect.width, 1);
        height = Math.max(rect.height, 1);
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        const count = Math.min(82, Math.max(38, Math.floor(width / 18)));
        points = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.34,
            vy: (Math.random() - 0.5) * 0.34,
            r: Math.random() * 1.8 + 1
        }));
    }

    function draw() {
        context.clearRect(0, 0, width, height);
        context.fillStyle = 'rgba(32, 243, 198, 0.72)';
        context.strokeStyle = 'rgba(0, 167, 255, 0.16)';
        context.lineWidth = 1;

        points.forEach((point, index) => {
            if (!prefersReducedMotion) {
                point.x += point.vx;
                point.y += point.vy;

                if (point.x < 0 || point.x > width) point.vx *= -1;
                if (point.y < 0 || point.y > height) point.vy *= -1;
            }

            context.beginPath();
            context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
            context.fill();

            for (let next = index + 1; next < points.length; next += 1) {
                const other = points[next];
                const dx = point.x - other.x;
                const dy = point.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 135) {
                    context.globalAlpha = 1 - distance / 135;
                    context.beginPath();
                    context.moveTo(point.x, point.y);
                    context.lineTo(other.x, other.y);
                    context.stroke();
                    context.globalAlpha = 1;
                }
            }
        });

        animationFrame = requestAnimationFrame(draw);
    }

    resizeCanvas();
    draw();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('beforeunload', () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
    });
}

initAiHeroCanvas();

// ==================== Notification Styles (add to page) ====================
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 2000;
            opacity: 0;
            transform: translateX(400px);
            transition: all 0.3s ease;
        }

        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }

        .notification-success {
            background: #10b981;
            color: white;
        }

        .notification-error {
            background: #ef4444;
            color: white;
        }

        .notification-info {
            background: #3b82f6;
            color: white;
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-weight: 500;
        }

        @media (max-width: 768px) {
            .notification {
                left: 20px;
                right: 20px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
}

addNotificationStyles();

// ==================== Page Load Animation ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Initial page fade in
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// ==================== Counter Animation for Stats ====================
function animateCounters() {
    const stats = document.querySelectorAll('.stat h3');
    
    stats.forEach(stat => {
        const target = parseInt(stat.innerText);
        if (isNaN(target)) return;
        
        let count = 0;
        const increment = target / 30;
        
        const updateCount = () => {
            count += increment;
            if (count < target) {
                stat.innerText = Math.floor(count) + '+';
                requestAnimationFrame(updateCount);
            } else {
                stat.innerText = target + '+';
            }
        };
        
        updateCount();
    });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                animateCounters();
                entry.target.setAttribute('data-animated', 'true');
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// ==================== Keyboard Navigation ====================
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
    }
});

// ==================== Portfolio Item Click ====================
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', function() {
        showNotification('Portfolio item details would open here', 'info');
    });
});

console.log('TeckSeek - Site initialized successfully!');

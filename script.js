// Page Transition
const pageTransition = document.getElementById('page-transition');

// On load: start opaque, fade to transparent
if (pageTransition) {
    pageTransition.classList.add('active');
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            pageTransition.classList.remove('active');
        });
    });
}

// On any internal link click: fade to opaque then navigate
document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || anchor.getAttribute('target') === '_blank' || anchor.hasAttribute('download')) return;
    e.preventDefault();
    if (pageTransition) {
        pageTransition.classList.add('active');
        setTimeout(() => { window.location = href; }, 460);
    } else {
        window.location = href;
    }
});

// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Check local storage or system preference
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
if (currentTheme) {
    htmlEl.setAttribute('data-theme', currentTheme);
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    htmlEl.setAttribute('data-theme', 'light');
}

themeToggleBtn.addEventListener('click', () => {
    let theme = htmlEl.getAttribute('data-theme');
    if (theme === 'dark') {
        htmlEl.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        htmlEl.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
const cursorText = document.getElementById('cursor-text');
const profileImage = document.querySelector('.profile-img');


function updateCursorAndFollower(e) {
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else if (e.clientX !== undefined) {
        clientX = e.clientX;
        clientY = e.clientY;
    } else {
        return;
    }

    // Small dot
    cursor.style.left = clientX + 'px';
    cursor.style.top = clientY + 'px';
    
    // Follower circle (slightly delayed)
    cursorFollower.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
    }, { duration: 150, fill: "forwards" });
    
}

document.addEventListener('mousemove', updateCursorAndFollower);
document.addEventListener('touchmove', updateCursorAndFollower, {passive: true});

const hoverElements = document.querySelectorAll('a, button, .project-row');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hover-state'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hover-state'));
});

if (profileImage) {
    const activateHover = () => {
        document.body.classList.add('image-hover-state');
        if (cursorText) cursorText.textContent = "Data Analyst";
        

    };

    const deactivateHover = () => {
        document.body.classList.remove('image-hover-state');
        if (cursorText) cursorText.textContent = "";
        

    };

    profileImage.addEventListener('mouseenter', activateHover);
    profileImage.addEventListener('mouseleave', deactivateHover);
    profileImage.addEventListener('touchstart', activateHover, {passive: true});
    profileImage.addEventListener('touchend', deactivateHover);
    profileImage.addEventListener('touchcancel', deactivateHover);
}

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navCenter = document.querySelector('.nav-center');
let menuOpen = false;

hamburger.addEventListener('click', () => {
    if (!menuOpen) {
        hamburger.querySelector('.line1').style.transform = 'rotate(45deg) translate(5px, 5px)';
        hamburger.querySelector('.line2').style.transform = 'rotate(-45deg) translate(5px, -5px)';
        navCenter.classList.add('active');
        menuOpen = true;
    } else {
        hamburger.querySelector('.line1').style.transform = 'none';
        hamburger.querySelector('.line2').style.transform = 'none';
        navCenter.classList.remove('active');
        menuOpen = false;
    }
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (menuOpen) {
            hamburger.click();
        }
    });
});

// Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-row, .about-grid, .section-title').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
    observer.observe(el);
});


// ==========================================
// Newsletter Auto-Reply via EmailJS
// ==========================================
(function () {
    // -----------------------------------------------------------------
    // CONFIGURATION — replace with your EmailJS values
    // 1. Sign up free at https://www.emailjs.com/
    // 2. Create an Email Service (Gmail works great)
    // 3. Create an Email Template with variables: {{to_email}}
    // 4. Paste your Public Key, Service ID, and Template ID below
    // -----------------------------------------------------------------
    // Keys are loaded from config.js (gitignored) → window.ENV
    const EMAILJS_PUBLIC_KEY  = (typeof ENV !== 'undefined') ? ENV.EMAILJS_PUBLIC_KEY  : '';
    const EMAILJS_SERVICE_ID  = (typeof ENV !== 'undefined') ? ENV.EMAILJS_SERVICE_ID  : '';
    const EMAILJS_TEMPLATE_ID = (typeof ENV !== 'undefined') ? ENV.EMAILJS_TEMPLATE_ID : '';

    const form    = document.getElementById('newsletter-form');
    const emailIn = document.getElementById('newsletter-email');
    const toast   = document.getElementById('nl-toast');

    if (!form || !toast) return;

    // Initialise EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    function showToast(message, type = 'success', duration = 4000) {
        toast.textContent = message;
        toast.className = `show ${type}`;
        setTimeout(() => { toast.className = ''; }, duration);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userEmail = emailIn.value.trim();
        if (!userEmail) return;

        if (typeof emailjs === 'undefined') {
            showToast('Email service not loaded. Try again later.', 'error');
            return;
        }

        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            // Demo mode — not yet configured
            showToast('✅ Thanks! (EmailJS not configured yet)', 'success');
            form.reset();
            return;
        }

        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_email: userEmail,    // ← recipient (set {{to_email}} in EmailJS "To Email" field)
                to_name: 'Subscriber',
                from_name: 'PVS Narayana Murthy',
                subject: 'Thanks for subscribing!',
                message: "Hey! Thanks for signing up. There are no new projects yet, but you'll be the first to know when something drops! 🚀\n\n– Narayana Murthy"
            });
            showToast('📬 Subscribed! Check your inbox.', 'success');
            form.reset();
        } catch (err) {
            console.error('EmailJS error:', err);
            showToast('❌ Failed to send. Please try again.', 'error');
        }
    });
}());

// ==========================================
// Magnetic UI Effect
// ==========================================
(function () {
    if (typeof gsap === 'undefined') return;

    const RADIUS = 100;    // px — attraction starts within this distance
    const MAX_MOVE = 25;   // px — max element displacement
    const TEXT_MULTIPLIER = 1.6; // text moves faster than border for depth effect

    const magneticEls = document.querySelectorAll('.magnetic');

    magneticEls.forEach(el => {
        const magText = el.querySelector('.mag-text');

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();

            // Center of the element
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            // Distance from mouse to element center
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < RADIUS) {
                // Normalise and scale
                const strength = (RADIUS - dist) / RADIUS; // 0..1
                const moveX = (dx / RADIUS) * MAX_MOVE * strength;
                const moveY = (dy / RADIUS) * MAX_MOVE * strength;

                // Animate element body
                gsap.to(el, {
                    x: moveX,
                    y: moveY,
                    duration: 0.4,
                    ease: 'power2.out'
                });

                // Animate text slightly faster (parallax depth)
                if (magText) {
                    gsap.to(magText, {
                        x: moveX * TEXT_MULTIPLIER,
                        y: moveY * TEXT_MULTIPLIER,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }

                // Custom cursor expand
                if (cursor) cursor.classList.add('cursor-magnetic');
            }
        });

        el.addEventListener('mouseleave', () => {
            // Spring back with elastic bounce
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.4)'
            });

            if (magText) {
                gsap.to(magText, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.35)'
                });
            }

            // Reset cursor
            if (cursor) cursor.classList.remove('cursor-magnetic');
        });
    });
}());

// ==========================================
// Dynamic Active Link Highlighting
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname;
    
    let hasPageMatch = false;
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        const filename = href.split('/').pop();
        if (filename && filename !== 'index.html' && href.indexOf('#') === -1) {
            if (currentPath.endsWith(filename)) {
                link.classList.add('active-link');
                hasPageMatch = true;
            }
        }
    });

    if (currentPath.includes('project-') && !hasPageMatch) {
        navLinks.forEach(link => {
            if (link.getAttribute('href').includes('#projects')) {
                link.classList.add('active-link');
                hasPageMatch = true;
            }
        });
    }

    const sections = [];
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        if (href.startsWith('#') && href !== '#') {
            const section = document.querySelector(href);
            if (section) {
                sections.push({ link, section });
            }
        } else if (href.includes('index.html#')) {
            const hash = href.substring(href.indexOf('#'));
            const section = document.querySelector(hash);
            if (section) {
                sections.push({ link, section });
            }
        }
    });

    if (sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sections.forEach(s => s.link.classList.remove('active-link'));
                    const activePair = sections.find(s => s.section.id === entry.target.id);
                    if (activePair) {
                        activePair.link.classList.add('active-link');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(s => observer.observe(s.section));
    }
});


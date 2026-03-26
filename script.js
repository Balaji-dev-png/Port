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
    
    let targetHref = href;
    if (!targetHref.includes('nav=1')) {
        // Split off any hash so ?nav=1 is inserted before the fragment
        const hashIdx = targetHref.indexOf('#');
        if (hashIdx !== -1) {
            const base = targetHref.substring(0, hashIdx);
            const hash = targetHref.substring(hashIdx);
            targetHref = (base.includes('?') ? base + '&nav=1' : base + '?nav=1') + hash;
        } else {
            targetHref += targetHref.includes('?') ? '&nav=1' : '?nav=1';
        }
    }

    if (pageTransition) {
        pageTransition.classList.add('active');
        setTimeout(() => { window.location = targetHref; }, 460);
    } else {
        window.location = targetHref;
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
                message: "Hey! Thanks for subscribing. There are no new projects yet, but you'll be the first to know when something drops! 🚀\n\n– Narayana Murthy"
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



// --- GLOBAL LOADER LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('global-loader');
    if (!loader) return;

    if (window.location.search.includes('nav=1') || window.location.hash.includes('nav=1')) {
        loader.style.display = 'none';
        return;
    }

    // Lock scroll immediately while loading
    document.body.style.overflow = 'hidden';

    // Spotlight logic
    const filledText = loader.querySelector('.filled-text');
    document.addEventListener('mousemove', (e) => {
        if (filledText && !loader.classList.contains('hidden')) {
            const rect = filledText.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            filledText.style.setProperty('--mouse-x', `${x}px`);
            filledText.style.setProperty('--mouse-y', `${y}px`);
        }
    });

    let currentSpotlightSize = 150;
    document.addEventListener('wheel', (e) => {
        if (filledText && !loader.classList.contains('hidden')) {
            currentSpotlightSize += e.deltaY * -0.2;
            currentSpotlightSize = Math.max(50, Math.min(currentSpotlightSize, 600));
            filledText.style.setProperty('--spotlight-size', `${currentSpotlightSize}px`);
        }
    });

    const progressBar = document.getElementById('progressBar');
    const percentageText = document.getElementById('percentageText');
    let progress = 0;
    const intervalTime = 15;

    const loadingInterval = setInterval(() => {
        const speed = Math.random() < 0.3 ? 0 : Math.random() * 3;
        progress += speed;

        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);

            setTimeout(() => {
                if (progressBar) progressBar.style.opacity = '0';
                if (percentageText) percentageText.style.opacity = '0';
                
                setTimeout(() => {
                    loader.classList.add('hidden');
                    document.body.style.overflow = '';
                }, 400); // Wait for progress bar fadeout
            }, 600); // Linger at 100% for a moment
        }

        if (progressBar && percentageText) {
            progressBar.style.width = `${progress}%`;
            percentageText.textContent = `${Math.floor(progress).toString().padStart(2, '0')}%`;
        }
    }, intervalTime);
});

// --- Hover Image Preview Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Only add if not already present
    if (document.getElementById('hover-preview')) return;
    
    const hoverPreview = document.createElement('div');
    hoverPreview.id = 'hover-preview';
    document.body.appendChild(hoverPreview);

    const previewElements = document.querySelectorAll('.project-row, .resume-btn-inline');

    previewElements.forEach(row => {
        row.addEventListener('mouseenter', (e) => {
            let imgSrc = row.getAttribute('data-preview');
            // Dynamically provide a preview for the resume button if not explicitly set
            if (!imgSrc && row.classList.contains('resume-btn-inline')) {
                imgSrc = window.location.pathname.includes('htmlfiles') 
                    ? '../images/image.png' 
                    : 'images/image.png';
            }

            if (imgSrc) {
                hoverPreview.style.backgroundImage = `url(${imgSrc})`;
                hoverPreview.classList.add('active');
            }
        });
        
        row.addEventListener('mousemove', (e) => {
            if (typeof gsap !== 'undefined') {
                gsap.to(hoverPreview, {
                    x: e.clientX + 20,
                    y: e.clientY + 20,
                    duration: 0.4,
                    ease: 'power3.out'
                });
            } else {
                hoverPreview.style.left = (e.clientX + 20) + 'px';
                hoverPreview.style.top = (e.clientY + 20) + 'px';
            }
        });

        row.addEventListener('mouseleave', () => {
            hoverPreview.classList.remove('active');
        });
    });
});

// ==========================================
// 3D Puzzle Cube — 3x3x3 with Scroll Path
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const puzzleContainer = document.getElementById('puzzle-cube-container');
    const cubeWrapper = document.querySelector('.cube-wrapper');
    if (!puzzleContainer || !cubeWrapper) return;

    // ── 1. Build 3×3×3 cube programmatically ──────────────────────
    const GRID  = 3;
    const SIZE  = 30;  // px per cubie (matches CSS face size)
    const GAP   = 0;   // gap between cubies (0 = touching)
    const STEP  = SIZE + GAP;
    const HALF  = (GRID - 1) / 2;  // 1.0 for 3x3

    // Colours for each face (matches CSS classes)
    const faceColors = {
        front:  '#e74c3c',   // Red
        back:   '#e67e22',   // Orange
        right:  '#3498db',   // Blue
        left:   '#2ecc71',   // Green
        top:    '#f1c40f',   // Yellow
        bottom: '#ecf0f1',   // White
    };

    const cubies = [];

    for (let xi = 0; xi < GRID; xi++) {
        for (let yi = 0; yi < GRID; yi++) {
            for (let zi = 0; zi < GRID; zi++) {
                const cubie = document.createElement('div');
                cubie.classList.add('cubie');

                const xPos = (xi - HALF) * STEP;
                const yPos = (yi - HALF) * STEP;
                const zPos = (zi - HALF) * STEP;

                cubie.style.setProperty('--x', `${xPos}px`);
                cubie.style.setProperty('--y', `${yPos}px`);
                cubie.style.setProperty('--z', `${zPos}px`);

                // Six faces
                const faces = [
                    { cls: 'f-front',  tx: 'rotateY(0deg)',    tz: `${SIZE/2}px` },
                    { cls: 'f-back',   tx: 'rotateY(180deg)',  tz: `${SIZE/2}px` },
                    { cls: 'f-right',  tx: 'rotateY(90deg)',   tz: `${SIZE/2}px` },
                    { cls: 'f-left',   tx: 'rotateY(-90deg)',  tz: `${SIZE/2}px` },
                    { cls: 'f-top',    tx: 'rotateX(90deg)',   tz: `${SIZE/2}px` },
                    { cls: 'f-bottom', tx: 'rotateX(-90deg)',  tz: `${SIZE/2}px` },
                ];

                faces.forEach(({ cls, tx, tz }) => {
                    const face = document.createElement('div');
                    face.classList.add('face', cls);
                    cubie.appendChild(face);
                });

                cubeWrapper.appendChild(cubie);
                cubies.push({ el: cubie, xPos, yPos, zPos });
            }
        }
    }

    // ── 2. Scramble: random rotation per cubie ─────────────────────
    const mults = [-2, -1, 1, 2];
    const rndM  = () => mults[Math.floor(Math.random() * mults.length)];

    cubies.forEach(({ el }) => {
        el.style.setProperty('--rX', `${rndM() * 90}deg`);
        el.style.setProperty('--rY', `${rndM() * 90}deg`);
        el.style.setProperty('--rZ', `${rndM() * 90}deg`);
    });

    // ── 3. Scroll-to-solve: unscramble each cubie as page scrolls ──
    cubies.forEach(({ el }) => {
        gsap.to(el, {
            '--rX': '0deg',
            '--rY': '0deg',
            '--rZ': '0deg',
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 2,
            }
        });
    });

    // ── 4. Ambient continuous rotation of the cube-wrapper ─────────
    gsap.set(cubeWrapper, { rotationX: -30, rotationY: 45 });
    gsap.to(cubeWrapper, {
        rotationY: '+=360',
        rotationX: '+=360',
        duration: 20,
        repeat: -1,
        ease: 'none',
    });

    // ── 5. Trajectory: cube drifts through empty spaces on scroll ──
    const trajectoryTween = gsap.to(puzzleContainer, {
        keyframes: [
            { top: '10%',  left: 'auto', right: '5%',   ease: 'power1.inOut' },
            { top: '30%',  left: '3%',   right: 'auto', ease: 'power1.inOut' },
            { top: '50%',  left: 'auto', right: '4%',   ease: 'power1.inOut' },
            { top: '70%',  left: '4%',   right: 'auto', ease: 'power1.inOut' },
            { top: '88%',  left: 'auto', right: '5%',   ease: 'power1.inOut' },
        ],
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2,
        }
    });

    // ── 6. Drag-to-place ─────────────────────────────────────────
    // The element is position:fixed so top/left are VIEWPORT coords.
    // Never add scrollX/scrollY — that's for absolute positioning only.
    let isDragging  = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let userPlaced  = false; // Once dragged once, freeze trajectory

    puzzleContainer.style.cursor = 'grab';

    const startDrag = (clientX, clientY) => {
        isDragging = true;

        // Snapshot current viewport position
        const rect   = puzzleContainer.getBoundingClientRect();
        dragOffsetX  = clientX - rect.left;
        dragOffsetY  = clientY - rect.top;

        if (!userPlaced) {
            userPlaced = true;
            // Kill only the positional trajectory, not the solve tweens
            gsap.killTweensOf(puzzleContainer);
            // Convert to fixed-position px (no scroll offset needed)
            puzzleContainer.style.right  = 'auto';
            puzzleContainer.style.bottom = 'auto';
            puzzleContainer.style.left   = `${rect.left}px`;
            puzzleContainer.style.top    = `${rect.top}px`;
        }

        puzzleContainer.style.cursor     = 'grabbing';
        puzzleContainer.style.transition = 'none';
    };

    const onDrag = (clientX, clientY) => {
        if (!isDragging) return;
        // Keep purely in viewport coords (fixed positioning)
        puzzleContainer.style.left = `${clientX - dragOffsetX}px`;
        puzzleContainer.style.top  = `${clientY - dragOffsetY}px`;
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        puzzleContainer.style.cursor     = 'grab';
        puzzleContainer.style.transition = 'transform 0.3s ease';
    };

    // Mouse
    puzzleContainer.addEventListener('mousedown', e => {
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
    });
    document.addEventListener('mousemove', e => onDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup',   endDrag);

    // Touch
    puzzleContainer.addEventListener('touchstart', e => {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    document.addEventListener('touchmove', e => {
        if (!isDragging) return;
        e.preventDefault();
        onDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    document.addEventListener('touchend', endDrag);
});

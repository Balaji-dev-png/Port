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
const resumePointer = document.getElementById('resume-pointer');
const resumePath = document.getElementById('resume-path');
const resumeArrowhead = document.getElementById('resume-arrowhead');
const resumeButton = document.querySelector('.resume-btn-inline');

let isDrawingLine = false;
let followerX = window.innerWidth / 2, followerY = window.innerHeight / 2;

function updateSVGPath() {
    if (!resumeButton) return;
    const btnRect = resumeButton.getBoundingClientRect();
    const targetX = btnRect.left + (btnRect.width / 2);
    const targetY = btnRect.top;
    
    // Draw a curved path from cursor to the button
    const pathD = `M ${mouseX} ${mouseY} Q ${mouseX} ${(mouseY + targetY)/2} ${targetX} ${targetY - 15}`;
    resumePath.setAttribute('d', pathD);
    
    // Calculate angle at the end of the curve for arrowhead rotation
    const dx = targetX - mouseX;
    const dy = (targetY - 15) - ((mouseY + targetY)/2);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Position and rotate arrowhead
    resumeArrowhead.setAttribute('transform', `translate(${targetX}, ${targetY - 15}) rotate(${angle})`);
}

document.addEventListener('mousemove', (e) => {
    // Small dot
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Follower circle (slightly delayed)
    cursorFollower.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
    }, { duration: 150, fill: "forwards" });
    
    if (isDrawingLine) {
        updateSVGPath();
    }
});

const hoverElements = document.querySelectorAll('a, button, .project-row');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hover-state'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hover-state'));
});

if (profileImage) {
    profileImage.addEventListener('mouseenter', () => {
        document.body.classList.add('image-hover-state');
        if (cursorText) cursorText.textContent = "Data Analyst";
        
        // Show line
        isDrawingLine = true;
        if (resumePointer) {
            resumePointer.classList.remove('hidden');
            updateSVGPath();
        }
    });
    profileImage.addEventListener('mouseleave', () => {
        document.body.classList.remove('image-hover-state');
        if (cursorText) cursorText.textContent = "";
        
        // Hide line
        isDrawingLine = false;
        if (resumePointer) resumePointer.classList.add('hidden');
    });
}

// Spotlight Effect
const spotlightOverlay = document.getElementById('spotlight-overlay');
const spotlightToggleBtn = document.getElementById('spotlight-toggle');
const spotlightControls = document.getElementById('spotlight-controls');
const spotlightSlider = document.getElementById('spotlight-slider');

// Default to off
let isSpotlightActive = false;
let currentMouseX = window.innerWidth / 2;
let currentMouseY = window.innerHeight / 2;

spotlightToggleBtn.classList.add('inactive');
spotlightOverlay.style.opacity = '0';

function updateSpotlight() {
    if (!isSpotlightActive) return;
    const theme = htmlEl.getAttribute('data-theme');
    const radius = spotlightSlider.value; // grabs value from 10 to 60
    const colorStops = theme === 'dark' 
        ? `rgba(0,0,0,0) 0%, rgba(0,0,0,0.96) ${radius}vw` 
        : `rgba(255,255,255,0) 0%, rgba(255,255,255,0.96) ${radius}vw`;
        
    spotlightOverlay.style.background = `radial-gradient(circle at ${currentMouseX}px ${currentMouseY}px, ${colorStops})`;
}

spotlightToggleBtn.addEventListener('click', () => {
    isSpotlightActive = !isSpotlightActive;
    if (isSpotlightActive) {
        spotlightToggleBtn.classList.remove('inactive');
        spotlightOverlay.style.opacity = '1';
        spotlightControls.classList.remove('hidden');
        updateSpotlight();
    } else {
        spotlightToggleBtn.classList.add('inactive');
        spotlightOverlay.style.opacity = '0';
        spotlightControls.classList.add('hidden');
    }
});

spotlightSlider.addEventListener('input', () => {
    updateSpotlight();
});

document.addEventListener('mousemove', (e) => {
    currentMouseX = e.clientX;
    currentMouseY = e.clientY;
    if (isSpotlightActive) {
        updateSpotlight();
    }
});

// Reset spotlight entirely on theme change so the gradient updates on next tick
themeToggleBtn.addEventListener('click', () => {
    if (isSpotlightActive) {
        spotlightOverlay.style.background = 'transparent';
    }
});

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

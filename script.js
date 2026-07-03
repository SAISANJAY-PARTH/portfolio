// ==========================================================================
// 1. HERO SECTION TYPING EFFECT
// ==========================================================================
const words = [
    "Financial Data Analyst",
    "Risk Analytics Specialist",
    "Machine Learning Developer",
    "Business Intelligence Architect"
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingDelay = 80;
const erasingDelay = 40;
const newWordDelay = 2200;
const typingTextElement = document.getElementById("typing-text");

function type() {
    if (!typingTextElement) return;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        charIndex--;
        typingTextElement.textContent = currentWord.substring(0, charIndex);
    } else {
        charIndex++;
        typingTextElement.textContent = currentWord.substring(0, charIndex);
    }

    let typeSpeed = typingDelay;

    if (isDeleting) {
        typeSpeed /= 2;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = newWordDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
}


// ==========================================================================
// 2. DYNAMIC TERMINAL CONSOLE TABS
// ==========================================================================
function initConsoleTabs() {
    const tabs = document.querySelectorAll(".console-tab");
    const blocks = document.querySelectorAll(".console-block");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            blocks.forEach(b => b.classList.remove("active"));

            tab.classList.add("active");
            const targetId = `code-${tab.getAttribute("data-tab")}`;
            const targetBlock = document.getElementById(targetId);
            if (targetBlock) targetBlock.classList.add("active");
        });
    });
}


// ==========================================================================
// 3. LIGHT / DARK THEME TOGGLE WITH LOCALSTORAGE & CANVAS ADAPTATION
// ==========================================================================
const themeToggleBtn = document.getElementById("theme-toggle");
const bodyElement = document.body;

function applyTheme(theme) {
    if (theme === "light") {
        bodyElement.classList.remove("dark-theme");
        bodyElement.classList.add("light-theme");
    } else {
        bodyElement.classList.remove("light-theme");
        bodyElement.classList.add("dark-theme");
    }
    if (window.updateParticleColors) window.updateParticleColors();
}

const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
applyTheme(savedTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = bodyElement.classList.contains("dark-theme") ? "dark" : "light";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        localStorage.setItem("portfolio-theme", nextTheme);
    });
}


// ==========================================================================
// 4. PROJECT FILTER LOGIC
// ==========================================================================
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const selectedFilter = button.getAttribute("data-filter");

        projectCards.forEach(card => {
            const cardCategory = card.getAttribute("data-category");
            if (selectedFilter === "all" || cardCategory === selectedFilter) {
                card.classList.remove("hide");
            } else {
                card.classList.add("hide");
            }
        });
    });
});


// ==========================================================================
// 5. MOBILE HAMBURGER MENU OVERLAY
// ==========================================================================
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileNavOverlay = document.getElementById("mobile-nav");

function toggleMobileMenu() {
    if (!mobileNavOverlay || !mobileMenuBtn) return;
    mobileNavOverlay.classList.toggle("open");
    
    if (mobileNavOverlay.classList.contains("open")) {
        mobileMenuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`;
    } else {
        mobileMenuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
    }
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
}


// ==========================================================================
// 6. SCROLL HIGHLIGHT & NAVBAR BOX SHADOW
// ==========================================================================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let current = "";
    const navbar = document.querySelector(".navbar");
    
    if (window.scrollY > 30) {
        navbar.style.boxShadow = "var(--card-shadow)";
    } else {
        navbar.style.boxShadow = "none";
    }

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 120)) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});


// ==========================================================================
// 7. INTERSECTION OBSERVER (FADE IN/UP ON SCROLL)
// ==========================================================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".scroll-reveal");
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px" // Trigger slightly before element enters view
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}


// ==========================================================================
// 8. INTERACTIVE MOUSE-REACTING CANVAS PARTICLE BACKGROUND
// ==========================================================================
function initParticleCanvas() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    let particleCount = 45;
    
    if (window.innerWidth < 768) {
        particleCount = 20;
    }

    // Mouse coordinates configuration
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener("mousemove", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    let connectionColor = "rgba(16, 185, 129, 0.05)";
    let particleColor = "rgba(16, 185, 129, 0.2)";
    let mouseLineColor = "rgba(16, 185, 129, 0.08)";

    window.updateParticleColors = function() {
        const isDark = bodyElement.classList.contains("dark-theme");
        connectionColor = isDark ? "rgba(16, 185, 129, 0.04)" : "rgba(5, 150, 105, 0.03)";
        particleColor = isDark ? "rgba(16, 185, 129, 0.12)" : "rgba(5, 150, 105, 0.08)";
        mouseLineColor = isDark ? "rgba(99, 102, 241, 0.18)" : "rgba(37, 99, 235, 0.12)"; // Indigo / Blue pointer trace
    };
    window.updateParticleColors();

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener("resize", () => {
        setCanvasSize();
        particleCount = window.innerWidth < 768 ? 20 : 45;
        createParticles();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1.2;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }

        draw() {
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        particlesArray = [];
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        const maxDist = 135;
        for (let a = 0; a < particlesArray.length; a++) {
            
            // Connect to mouse pointer
            if (mouse.x !== null && mouse.y !== null) {
                const mdx = particlesArray[a].x - mouse.x;
                const mdy = particlesArray[a].y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                
                if (mdist < mouse.radius) {
                    ctx.strokeStyle = mouseLineColor;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            // Connect to adjacent particles
            for (let b = a + 1; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDist) {
                    ctx.strokeStyle = connectionColor;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        connectParticles();
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();
}


// Initialize All Scripts
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 800);
    initConsoleTabs();
    initScrollReveal();
    initParticleCanvas();
});

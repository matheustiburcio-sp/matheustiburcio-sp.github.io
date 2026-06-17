// ================================================================
//  ANIMAÇÕES DE REVEAL — scroll-based (layout PC)
// ================================================================
(function () {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                } else {
                    entry.target.classList.remove("visible");
                }
            });
        },
        { threshold: 0.08 }
    );

    function initAnimations() {
        // Observa elementos com animação de scroll
        document.querySelectorAll(".animate-scroll, .animate-hero").forEach((el) => {
            observer.observe(el);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAnimations);
    } else {
        initAnimations();
    }
})();

// ================================================================
//  LAYOUT MOBILE — navegação por seções
// ================================================================
const sections = ["home", "skills", "education", "contact", "projects"];
let currentIndex = 0;

const navLinks = {
    education: document.getElementById("nav-education"),
    contact: document.getElementById("nav-contact"),
    projects: document.getElementById("nav-projects")
};

const navDefaults = {
    education: { text: "(educação)", target: "education" },
    contact: { text: "(contact)", target: "contact" },
    projects: { text: "(projects)", target: "projects" }
};

const backBtn  = document.getElementById("backBtn");
const homeBtn  = document.getElementById("homeBtn");
const navbar   = document.getElementById("navbar");
const btnPrev  = document.getElementById("btnPrev");
const btnNext  = document.getElementById("btnNext");
const content  = document.getElementById("content");

let isTouchScrolling = false;
let touchStartY = 0;

function resetNavLinks() {
    Object.keys(navLinks).forEach((key) => {
        const link = navLinks[key];
        const cfg  = navDefaults[key];
        link.textContent = cfg.text;
        link.style.display = "inline";
        link.onclick = () => navigateTo(cfg.target);
        link.classList.remove("active");
        link.classList.remove("contact-edu-shift");
    });
}

function showSection(id) {
    const index = sections.indexOf(id);
    if (index === -1 || index === currentIndex) return;
    currentIndex = index;
    updateView(true);
}

function navigateTo(id) { showSection(id); }

function nextSection() {
    if (isTouchScrolling) return;
    if (currentIndex < sections.length - 1) {
        currentIndex += 1;
        updateView(true);
    }
}

function prevSection() {
    if (isTouchScrolling) return;
    if (currentIndex > 0) {
        currentIndex -= 1;
        updateView(true);
    }
}

function goBack() { prevSection(); }

function updateButtons() {
    btnPrev.style.display = "inline-block";
    btnNext.style.display = "inline-block";
    btnPrev.textContent = "VOLTAR";
    btnNext.textContent = "AVANÇAR";
    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex === sections.length - 1;
}

function updateNavBySection(currentId) {
    resetNavLinks();
    navbar.classList.toggle("is-home", currentId === "home");

    backBtn.style.display = "none";
    homeBtn.style.display = "none";

    if (currentId === "home" || currentId === "skills") return;

    if (currentId === "education") {
        backBtn.style.display = "block";
        homeBtn.style.display = "block";
        navLinks.education.style.display = "none";
        return;
    }

    if (currentId === "contact") {
        backBtn.style.display = "block";
        homeBtn.style.display = "block";
        navLinks.education.textContent = "(habilidades)";
        navLinks.education.onclick = () => navigateTo("skills");
        navLinks.education.classList.add("contact-edu-shift");
        navLinks.contact.style.display = "none";
        return;
    }

    if (currentId === "projects") {
        backBtn.style.display = "block";
        homeBtn.style.display = "block";
        navLinks.projects.style.display = "none";
    }
}

function updateView(animate) {
    const currentId = sections[currentIndex];

    document.querySelectorAll(".page-section").forEach((section) => {
        section.classList.remove("active", "entering");
    });

    const activeSection = document.getElementById(currentId);
    if (activeSection) {
        activeSection.classList.add("active");
        if (animate) {
            activeSection.classList.add("entering");
            window.setTimeout(() => {
                activeSection.classList.remove("entering");
            }, 520);
        }
    }

    updateNavBySection(currentId);
    updateButtons();
    content.scrollTop = 0;
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextSection();
    if (event.key === "ArrowLeft"  || event.key === "ArrowUp")   prevSection();
});

content.addEventListener("touchstart", (event) => {
    touchStartY = event.changedTouches[0].screenY;
    isTouchScrolling = false;
}, { passive: true });

content.addEventListener("touchmove", (event) => {
    const touchY = event.changedTouches[0].screenY;
    if (Math.abs(touchStartY - touchY) > 8) isTouchScrolling = true;
}, { passive: true });

content.addEventListener("touchend", () => {
    window.setTimeout(() => { isTouchScrolling = false; }, 140);
}, { passive: true });

updateView(false);

// ================================================================
//  SCROLL SPY PC — marca link ativo na navbar conforme a seção
// ================================================================
function initPCScrollSpy() {
    const pcSections = document.querySelectorAll(".pc-section[id]");
    const pcNavLinks = document.querySelectorAll(".pc-navbar-links a");

    if (!pcSections.length || !pcNavLinks.length) return;

    const spyObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    pcNavLinks.forEach((link) => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${id}`
                        );
                    });
                }
            });
        },
        { root: null, threshold: 0.25 }
    );

    pcSections.forEach((section) => spyObserver.observe(section));
}

// ================================================================
//  NAV MOBILE — marca link ativo ao clicar
// ================================================================
function initMobileNavActive() {
    const mobileLinks = document.querySelectorAll(".top-nav a");
    mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
            mobileLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
        });
    });
    const homeLink = document.querySelector(".top-nav a[href='#home']");
    if (homeLink) homeLink.classList.add("active");
}

// ================================================================
//  NAVBAR PC — blur ao rolar
// ================================================================
function initNavbarScroll() {
    const nav = document.querySelector(".pc-navbar");
    if (!nav) return;

    const handleScroll = () => {
        if (window.scrollY > 60) {
            nav.style.backdropFilter = "blur(14px)";
            nav.style.background =
                "linear-gradient(to right, #332419e8, #1d1916cc, #3d312b40, #a58578cc)";
        } else {
            nav.style.backdropFilter = "blur(8px)";
            nav.style.background = "var(--nav-bg)";
        }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
}

// ================================================================
//  HERO PC — garante que a seção hero entra visível imediatamente
// ================================================================
function initHeroVisibility() {
    const hero = document.getElementById("pc-hero");
    if (!hero) return;

    // O hero já está na viewport ao carregar — marca como visível
    // após um frame para garantir que a transição CSS dispara
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            hero.classList.add("visible");
        });
    });
}

// ================================================================
//  INICIALIZAÇÃO
// ================================================================
document.addEventListener("DOMContentLoaded", () => {
    initPCScrollSpy();
    initMobileNavActive();
    initNavbarScroll();
    initHeroVisibility();
});
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dynamic gradient effect on scroll with dramatic section transitions
const gradientStops = [
    { h: 207, s: 28, l: 25 },   // Nav        
    { h: 233, s: 31, l: 31 },   // About       
    { h: 235, s: 31, l: 42 },   // Mission     
    { h: 226, s: 36, l: 32 },   // Projects    
    { h: 232, s: 20, l: 33 },   // Team        
    { h: 248, s: 21, l: 34 },   // Contact     
];



function lerp(a, b, t) { return a + (b - a) * t; }
 
const updateGradient = () => {
    const scrollH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollH > 0 ? window.scrollY / scrollH : 0;
 
    const scaled = pct * (gradientStops.length - 1);
    const idx = Math.min(Math.floor(scaled), gradientStops.length - 2);
    const t = scaled - idx;
 
    const a = gradientStops[idx];
    const b = gradientStops[idx + 1];
 
    const h = lerp(a.h, b.h, t);
    const s = lerp(a.s, b.s, t);
    const l = lerp(a.l, b.l, t);
 
    document.body.style.background = `linear-gradient(180deg,
        hsl(${h - 10}, ${Math.max(0, s - 20)}%, ${Math.min(100, l + 12)}%) 0%,
        hsl(${h},      ${s}%,                    ${l}%)                     50%,
        hsl(${h + 15}, ${Math.min(100, s + 15)}%, ${Math.max(0, l - 18)}%) 100%)`;
    document.body.style.backgroundAttachment = 'fixed';
 
 
};
 
window.addEventListener('scroll', updateGradient);
window.addEventListener('load', updateGradient);
updateGradient();
 
 
 
// Timeline — expand on "Show More"
function expandTimeline() {
    document.getElementById('timeline').closest('.timeline-wrapper').classList.add('expanded');
    document.getElementById('showLessWrap').classList.add('visible');
}
 
function collapseTimeline() {
    const wrapper = document.getElementById('timeline').closest('.timeline-wrapper');
    wrapper.classList.remove('expanded');
    document.getElementById('showLessWrap').classList.remove('visible');
    // scroll back to projects section top
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
 
// Timeline — hover shows image panel aligned to hovered item
const panel       = document.getElementById('timelineImagePanel');
const panelImg    = document.getElementById('panelImg');
const timelineRow = document.getElementById('timelineRow');
let   currentSrc  = '';
let   hideTimer   = null;
 
function showPanel(box, src) {
    clearTimeout(hideTimer);
    currentSrc   = src;
    panelImg.src = src;
 
    // Align panel vertically with the hovered box
    const wrapperRect = document.getElementById('timelineWrapper').getBoundingClientRect();
    const boxRect     = box.getBoundingClientRect();
    const panelH      = 200;
    const top         = (boxRect.top - wrapperRect.top) + (boxRect.height / 2) - (panelH / 2);
    panel.style.marginTop = Math.max(0, top) + 'px';
 
    panel.classList.add('visible');
    timelineRow.classList.add('preview-active');
}
 
function hidePanel() {
    hideTimer = setTimeout(() => {
        panel.classList.remove('visible');
        timelineRow.classList.remove('preview-active');
        panelImg.src = '';
        currentSrc   = '';
    }, 80);
}
 
document.querySelectorAll('.timeline-item').forEach(item => {
    const box = item.querySelector('.timeline-content[data-img]');
    if (!box) return;
    item.addEventListener('mouseenter', () => showPanel(box, box.dataset.img));
    item.addEventListener('mouseleave', hidePanel);
    box.addEventListener('click', () => openLightbox(box.dataset.img));
});
 
panel.addEventListener('mouseenter', () => clearTimeout(hideTimer));
panel.addEventListener('mouseleave', hidePanel);
 
function openLightboxFromPanel() {
    if (currentSrc) openLightbox(currentSrc);
}
 
// Lightbox with zoom
let zoomLevel = 1;
 
function openLightbox(src) {
    const lb  = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    img.src = src;
    zoomLevel = 1;
    img.style.transform = 'scale(1)';
    img.style.cursor = 'zoom-in';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}
 
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.getElementById('lightboxImg').src = '';
    document.body.style.overflow = '';
    zoomLevel = 1;
}
 
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('lightboxImg').addEventListener('click', function (e) {
        e.stopPropagation();
        if (e.ctrlKey) {
            zoomLevel = Math.max(1, zoomLevel - 0.75);
        } else {
            zoomLevel = zoomLevel >= 3 ? 1 : zoomLevel + 0.75;
        }
        this.style.transform = 'scale(' + zoomLevel + ')';
        this.style.cursor = zoomLevel > 1 ? 'zoom-out' : 'zoom-in';
    });
});
 
// Close lightbox on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
});
 
// Scroll-in animation for cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};
 
const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);
 
document.querySelectorAll('.team-card, .about-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});
 
// Active navigation link highlighting
const highlightNavLink = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
 
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
 
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            link.style.textDecoration = 'underline';
        } else {
            link.style.textDecoration = 'none';
        }
    });
};
 
window.addEventListener('scroll', highlightNavLink);
 
console.log('Interact Club of SOS Portfolio loaded successfully!');
// ============================================
// ADVANCED VISUAL EFFECTS - NO HOLDING BACK
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  init3DCardTilts();
  initMagneticCursor();
  initBreathingAnimations();
  initChromaticAberration();
  initAdvancedParallax();
  initGeometricPatterns();
  initCinematicTransitions();
});

// ============================================
// 3D CARD TILT EFFECTS
// ============================================
function init3DCardTilts() {
  const cards = document.querySelectorAll('.data-card, .layer-card, .character-card, .pitch-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      card.style.transition = 'transform 0.1s ease-out';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease-out';
    });
  });
}

// ============================================
// MAGNETIC CURSOR EFFECT
// ============================================
function initMagneticCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'magnetic-cursor';
  document.body.appendChild(cursor);
  
  const cursorDot = document.createElement('div');
  cursorDot.className = 'magnetic-cursor-dot';
  document.body.appendChild(cursorDot);
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animateCursor() {
    // Smooth follow for outer cursor
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    // Faster follow for dot
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // Magnetic attraction to interactive elements
  const magneticElements = document.querySelectorAll('a, button, .cta-button, .preview-button');
  magneticElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursor.style.borderColor = 'rgba(0, 240, 255, 0.8)';
      cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.borderColor = 'rgba(0, 240, 255, 0.5)';
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

// ============================================
// BREATHING ANIMATIONS
// ============================================
function initBreathingAnimations() {
  const breathingElements = document.querySelectorAll('.section-number, .hero-title, .story-title');
  
  breathingElements.forEach((el, index) => {
    const delay = index * 0.5;
    el.style.animation = `breathe 4s ease-in-out ${delay}s infinite`;
  });
}

// ============================================
// CHROMATIC ABERRATION ON SCROLL - DISABLED FOR PERFORMANCE
// ============================================
function initChromaticAberration() {
  // Disabled - was causing performance issues
  // Can be re-enabled if needed
}

// ============================================
// ADVANCED PARALLAX LAYERS - DISABLED FOR PERFORMANCE
// ============================================
function initAdvancedParallax() {
  // Disabled - was causing layout shifts and performance issues
}

// ============================================
// GEOMETRIC PATTERN CANVAS - DISABLED FOR PERFORMANCE
// ============================================
function initGeometricPatterns() {
  // Disabled - was causing performance issues with multiple canvases
  // The main starfield canvas is enough
}

// ============================================
// CINEMATIC SECTION TRANSITIONS
// ============================================
function initCinematicTransitions() {
  const sections = document.querySelectorAll('.section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-active');
        
        // Add glitch effect on entry
        const title = entry.target.querySelector('.section-title');
        if (title) {
          title.classList.add('glitch-active');
          setTimeout(() => {
            title.classList.remove('glitch-active');
          }, 500);
        }
      }
    });
  }, {
    threshold: 0.3
  });
  
  sections.forEach(section => observer.observe(section));
}

// ============================================
// CSS ADDITIONS (Add to style.css)
// ============================================
const advancedStyles = `
/* Magnetic Cursor */
.magnetic-cursor {
  position: fixed;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(0, 240, 255, 0.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  transition: transform 0.2s ease-out, border-color 0.2s;
  mix-blend-mode: difference;
}

.magnetic-cursor-dot {
  position: fixed;
  width: 8px;
  height: 8px;
  background: rgba(0, 240, 255, 0.8);
  border-radius: 50%;
  pointer-events: none;
  z-index: 10001;
  transition: transform 0.2s ease-out;
}

/* Breathing Animation */
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.02);
    filter: brightness(1.1);
  }
}

/* Geometric Pattern Canvas */
.geometric-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.3;
}

/* Section Active State */
.section {
  opacity: 0.7;
  transition: opacity 0.8s ease-out;
}

.section-active {
  opacity: 1;
}

/* Enhanced Glitch */
.glitch-active {
  animation: glitch-intense 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes glitch-intense {
  0%, 100% {
    transform: translate(0);
    filter: hue-rotate(0deg);
  }
  20% {
    transform: translate(-3px, 3px);
    filter: hue-rotate(90deg);
  }
  40% {
    transform: translate(3px, -3px);
    filter: hue-rotate(180deg);
  }
  60% {
    transform: translate(-3px, -3px);
    filter: hue-rotate(270deg);
  }
  80% {
    transform: translate(3px, 3px);
    filter: hue-rotate(360deg);
  }
}

/* 3D Card Transform */
.data-card, .layer-card, .character-card {
  transform-style: preserve-3d;
  will-change: transform;
}

/* Hide default cursor on desktop */
@media (min-width: 1024px) {
  body {
    cursor: none;
  }
  
  a, button, .cta-button, .preview-button {
    cursor: none;
  }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = advancedStyles;
document.head.appendChild(styleSheet);


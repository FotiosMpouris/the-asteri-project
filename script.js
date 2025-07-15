// =================================================================
// THE ASTERI PROJECT - SCRIPT.JS - V7.0 (Definitive Version)
// - Starfield animation now has a 3D parallax effect on mouse move.
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
  initializeUnifiedEffect();
  document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && !e.target.closest('a')) {
      createParticle(e);
      createEnergyWave(e.pageX, e.pageY);
    }
  });
  setupMobileNav();
  window.addEventListener('scroll', handleScroll);
});

// =================================================================
// UNIFIED STARFIELD & HOLOGRAM ANIMATION WITH PARALLAX
// =================================================================
function initializeUnifiedEffect() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  // --- Parallax Mouse Tracker ---
  const mouse = { x: 0, y: 0 };
  
  // --- Starfield Setup ---
  let stars = [];
  const starCount = window.innerWidth < 768 ? 150 : 300;

  // --- Hologram Setup ---
  const hologramPoints = [];
  const numHologramPoints = 250;
  const hologramRadius = (Math.min(window.innerWidth, window.innerHeight) * 0.3);
  let angleX = 0;
  let angleY = 0;

  function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.x = canvas.width / 2;
    mouse.y = canvas.height / 2;
    
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: (Math.random() - 0.5) * 0.0005,
        // NEW: Depth property for parallax effect
        depth: Math.random() * 0.6 + 0.1 // 0.1 (far) to 0.7 (near)
      });
    }

    hologramPoints.length = 0;
    for (let i = 0; i < numHologramPoints; i++) {
        const phi = Math.acos(-1 + (2 * i) / numHologramPoints);
        const theta = Math.sqrt(numHologramPoints * Math.PI) * phi;
        hologramPoints.push({ x: hologramRadius * Math.cos(theta) * Math.sin(phi), y: hologramRadius * Math.sin(theta) * Math.sin(phi), z: hologramRadius * Math.cos(phi) });
    }
  }

  function drawStarfield() {
    // Calculate mouse offset from center for parallax
    const offsetX = (mouse.x - canvas.width / 2) / 20; // Divide to reduce effect intensity
    const offsetY = (mouse.y - canvas.height / 2) / 20;

    stars.forEach(star => {
      // Apply parallax shift
      const parallaxX = star.x + offsetX * star.depth;
      const parallaxY = star.y + offsetY * star.depth;
      
      const pulse = Math.sin(Date.now() * star.pulseSpeed + star.x) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(204, 214, 246, ${star.alpha * pulse})`;
      ctx.beginPath();
      ctx.arc(parallaxX, parallaxY, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawHologram() {
    const projectedPoints = hologramPoints.map(p => {
        const rotY_x = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
        const rotY_z = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);
        const rotX_y = p.y * Math.cos(angleX) - rotY_z * Math.sin(angleX);
        const rotX_z = p.y * Math.sin(angleX) + rotY_z * Math.cos(angleX);
        const perspective = 400 / (400 + rotX_z);
        return { 
            x: rotY_x * perspective + canvas.width / 2, 
            y: rotX_y * perspective + canvas.height / 2 + 50,
            z: rotX_z, 
            alpha: (rotX_z + hologramRadius) / (2 * hologramRadius) 
        };
    }).sort((a, b) => a.z - b.z);
    
    ctx.strokeStyle = 'rgba(0, 123, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < projectedPoints.length; i++) {
      for (let j = i + 1; j < projectedPoints.length; j++) {
        const dx = projectedPoints[i].x - projectedPoints[j].x;
        const dy = projectedPoints[i].y - projectedPoints[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 45) {
          ctx.beginPath();
          ctx.moveTo(projectedPoints[i].x, projectedPoints[i].y);
          ctx.lineTo(projectedPoints[j].x, projectedPoints[j].y);
          ctx.stroke();
        }
      }
    }

    projectedPoints.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha * 0.9})`;
      ctx.arc(p.x, p.y, p.alpha * 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStarfield();
    if (document.getElementById('hologram-hero')) {
        drawHologram();
    }
    angleY += 0.003;
    angleX += 0.001;

    requestAnimationFrame(animate);
  }

  // --- Event Listeners ---
  window.addEventListener('resize', setup);
  window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
  });

  setup();
  animate();
}


// --- Remaining original utility functions (unchanged) ---
function createParticle(e) {
  const container = document.getElementById('particles-container');
  if (!container) return;
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = (e.pageX + (Math.random() * 10 - 5)) + 'px';
  particle.style.top = (e.pageY + (Math.random() * 10 - 5)) + 'px';
  const size = Math.random() * 3 + 1;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  const duration = Math.random() * 1000 + 1000;
  container.appendChild(particle);
  setTimeout(() => {
    particle.style.opacity = '0';
    setTimeout(() => { if (container.contains(particle)) { container.removeChild(particle); } }, 500);
  }, duration);
}

function createEnergyWave(x, y) {
  const container = document.getElementById('particles-container');
  if (!container) return;
  const wave = document.createElement('div');
  wave.className = 'energy-wave';
  wave.style.left = (x - 100) + 'px';
  wave.style.top = (y - 100) + 'px';
  container.appendChild(wave);
  setTimeout(() => { if (container.contains(wave)) { container.removeChild(wave); } }, 3000);
}

function setupMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });
}

function handleScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

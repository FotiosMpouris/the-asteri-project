// =================================================================
// THE ASTERI PROJECT - SCRIPT.JS - V4.0
// Hologram is now the main background feature.
// Game and constellation logic have been removed.
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the new hologram directly on the main canvas
  initializeHologram();

  // Keep the original click effects
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
// NEW HOLOGRAPHIC PLANET ON THE MAIN CANVAS
// =================================================================
function initializeHologram() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const size = 600; // Fixed size for the hologram sphere area
  canvas.width = size;
  canvas.height = size;

  const points = [];
  const numPoints = 200;
  const radius = size * 0.35;
  let angleX = 0;
  let angleY = 0;

  // Generate points on a sphere
  for (let i = 0; i < numPoints; i++) {
    const phi = Math.acos(-1 + (2 * i) / numPoints);
    const theta = Math.sqrt(numPoints * Math.PI) * phi;
    points.push({
      x: radius * Math.cos(theta) * Math.sin(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(phi)
    });
  }

  function rotateAndProject(point) {
    // Rotate around Y axis
    const rotY_x = point.x * Math.cos(angleY) - point.z * Math.sin(angleY);
    const rotY_z = point.x * Math.sin(angleY) + point.z * Math.cos(angleY);
    // Rotate around X axis
    const rotX_y = point.y * Math.cos(angleX) - rotY_z * Math.sin(angleX);
    const rotX_z = point.y * Math.sin(angleX) + rotY_z * Math.cos(angleY); // Subtle wobble

    const perspective = 300 / (300 + rotX_z);
    
    return {
      x: rotY_x * perspective + canvas.width / 2,
      y: rotX_y * perspective + canvas.height / 2,
      z: rotX_z,
      alpha: (rotX_z + radius) / (2 * radius)
    };
  }

  function drawHologram() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Subtle scanlines for hologram effect
    ctx.fillStyle = 'rgba(0, 240, 255, 0.03)';
    for (let i = 0; i < canvas.height; i += 3) {
      ctx.fillRect(0, i, canvas.width, 1);
    }
    
    const projectedPoints = points.map(rotateAndProject);
    projectedPoints.sort((a, b) => a.z - b.z);

    // Draw connecting lines
    ctx.strokeStyle = 'rgba(0, 123, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < projectedPoints.length; i++) {
        for (let j = i + 1; j < projectedPoints.length; j++) {
            const dx = projectedPoints[i].x - projectedPoints[j].x;
            const dy = projectedPoints[i].y - projectedPoints[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 50) {
                ctx.beginPath();
                ctx.moveTo(projectedPoints[i].x, projectedPoints[i].y);
                ctx.lineTo(projectedPoints[j].x, projectedPoints[j].y);
                ctx.stroke();
            }
        }
    }
    
    // Draw points
    projectedPoints.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha * 0.9})`;
      ctx.arc(p.x, p.y, p.alpha * 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    angleY += 0.005;
    angleX += 0.001;

    requestAnimationFrame(drawHologram);
  }

  drawHologram();
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

// =================================================================
// THE ASTERI PROJECT - SCRIPT.JS - V3.0
// Replaced the game with a non-interactive 3D Hologram Planet effect.
// =================================================================

// Keep a reference to the background animation to manage its state.
window.backgroundAnimationId = null;

document.addEventListener('DOMContentLoaded', () => {
  initializeConstellationEffect();
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
// REPLACED `startGame` with `showHologram`
// The button on your page still calls `startGame()`, so we keep that name,
// but it now launches the hologram instead of the game.
// =================================================================
function startGame() {
  // Stop the background animation
  if (window.backgroundAnimationId) {
    cancelAnimationFrame(window.backgroundAnimationId);
    window.backgroundAnimationId = null;
  }

  // --- Create the Modal Overlay ---
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(10, 25, 47, 0.8); backdrop-filter: blur(5px);
    z-index: 2000; display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s ease;
  `;

  // --- Create a dedicated Canvas for the Hologram ---
  const hologramCanvas = document.createElement('canvas');
  overlay.appendChild(hologramCanvas);
  document.body.appendChild(overlay);

  // Fade in the overlay
  setTimeout(() => { overlay.style.opacity = '1'; }, 10);

  // --- Close Button ---
  const closeButton = document.createElement('div');
  closeButton.innerHTML = '×';
  closeButton.style.cssText = `
    position: absolute; top: 20px; right: 30px; font-size: 40px;
    color: var(--text-secondary); cursor: pointer; transition: color 0.3s ease;
  `;
  closeButton.onmouseover = () => { closeButton.style.color = 'var(--text-primary)'; };
  closeButton.onmouseout = () => { closeButton.style.color = 'var(--text-secondary)'; };
  overlay.appendChild(closeButton);

  const closeHologram = () => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(overlay);
      // Restart the background effect if it's not already running
      if (!window.backgroundAnimationId) {
        initializeConstellationEffect();
      }
    }, 300);
  };
  
  closeButton.addEventListener('click', closeHologram);
  overlay.addEventListener('click', (e) => {
      if (e.target === overlay) { // Only close if clicking the dark background
          closeHologram();
      }
  });


  // --- Hologram Logic ---
  const ctx = hologramCanvas.getContext('2d');
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.7;
  hologramCanvas.width = size;
  hologramCanvas.height = size;

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
    const rotX_z = point.y * Math.sin(angleX) + rotY_z * Math.cos(angleX);

    const perspective = 300 / (300 + rotX_z); // Simple perspective
    
    return {
      x: rotY_x * perspective + hologramCanvas.width / 2,
      y: rotX_y * perspective + hologramCanvas.height / 2,
      z: rotX_z,
      alpha: (rotX_z + radius) / (2 * radius) // Opacity based on depth
    };
  }

  function drawHologram() {
    ctx.clearRect(0, 0, hologramCanvas.width, hologramCanvas.height);
    
    // Draw subtle scanlines for hologram effect
    ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
    for (let i = 0; i < hologramCanvas.height; i += 4) {
      ctx.fillRect(0, i, hologramCanvas.width, 1);
    }
    
    const projectedPoints = points.map(rotateAndProject);
    projectedPoints.sort((a, b) => a.z - b.z); // Sort points to draw back-to-front

    // Draw connecting lines
    ctx.strokeStyle = 'rgba(0, 123, 255, 0.2)';
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
      ctx.arc(p.x, p.y, p.alpha * 2.5, 0, Math.PI * 2); // Size based on depth
      ctx.fill();
    });

    angleY += 0.005;
    angleX += 0.002;

    requestAnimationFrame(drawHologram);
  }

  drawHologram();
}


// =================================================================
// INTERACTIVE CONSTELLATION EFFECT (UNCHANGED)
// =================================================================
function initializeConstellationEffect() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  const starCount = window.innerWidth < 768 ? 100 : 200;
  const mouse = { x: undefined, y: undefined, radius: 150 };
  function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 1.5 + 1, baseAlpha: Math.random() * 0.5 + 0.5, alpha: 0 });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.alpha = star.baseAlpha * (Math.sin(Date.now() * 0.001 + star.x) * 0.5 + 0.5);
      ctx.fillStyle = `rgba(0, 240, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    connect();
  }
  function connect() {
    for (let a = 0; a < stars.length; a++) {
      for (let b = a; b < stars.length; b++) {
        let dx = stars[a].x - stars[b].x;
        let dy = stars[a].y - stars[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          let opacity = 1 - (distance / 120);
          ctx.strokeStyle = `rgba(0, 123, 255, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(stars[a].x, stars[a].y);
          ctx.lineTo(stars[b].x, stars[b].y);
          ctx.stroke();
        }
      }
      if (mouse.x !== undefined && mouse.y !== undefined) {
        let dxMouse = stars[a].x - mouse.x;
        let dyMouse = stars[a].y - mouse.y;
        let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distanceMouse < mouse.radius) {
          let opacity = 1 - (distanceMouse / mouse.radius);
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(stars[a].x, stars[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }
  function animate() {
    draw();
    window.backgroundAnimationId = requestAnimationFrame(animate);
  }
  window.addEventListener('resize', setupCanvas);
  window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
  window.addEventListener('mouseout', () => { mouse.x = undefined; mouse.y = undefined; });
  setupCanvas();
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

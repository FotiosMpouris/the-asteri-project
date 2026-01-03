// ============================================
// THE ASTERI PROJECT - MODERN SCRIPT 2025+
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeModernStarfield();
  initializeScrollAnimations();
  initializeInteractiveEffects();
  initializeNavbar();
  initializeSmoothScroll();
});

// ============================================
// MODERN STARFIELD WITH ENHANCED HOLOGRAM
// ============================================
function initializeModernStarfield() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  // Starfield
  let stars = [];
  const starCount = window.innerWidth < 768 ? 250 : 500;

  // Enhanced Hologram Sphere
  const hologramPoints = [];
  const numHologramPoints = 350;
  let hologramRadius = Math.min(window.innerWidth, window.innerHeight) * 0.22;
  let angleX = 0;
  let angleY = 0;
  let angleZ = 0;

  // Glitch effect
  let glitchActive = false;
  let glitchTimer = 0;

  function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    hologramRadius = Math.min(canvas.width, canvas.height) * 0.22;
    
    // Create enhanced stars
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.9 + 0.4,
        shimmerSpeed: (Math.random() + 0.3) * 0.0008,
        twinkleOffset: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.001 + 0.0005
      });
    }

    // Create hologram sphere points (Fibonacci sphere)
    hologramPoints.length = 0;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < numHologramPoints; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / numHologramPoints);
      hologramPoints.push({
        x: hologramRadius * Math.cos(theta) * Math.sin(phi),
        y: hologramRadius * Math.sin(theta) * Math.sin(phi),
        z: hologramRadius * Math.cos(phi),
        originalIndex: i
      });
    }
  }

  function drawModernStarfield() {
    stars.forEach(star => {
      // Enhanced shimmer with multiple wave functions
      const time = Date.now() * star.shimmerSpeed + star.twinkleOffset;
      const shimmer = (Math.sin(time) + 1) / 2;
      const twinkle = (Math.cos(time * 1.3) + 1) / 2;
      const pulse = (Math.sin(Date.now() * star.pulseSpeed) + 1) / 2;
      
      const currentAlpha = star.alpha * shimmer * twinkle * 0.7;
      const currentRadius = star.radius * (0.6 + shimmer * 0.4);

      // Occasional glitch effect
      let x = star.x;
      let y = star.y;
      if (glitchActive && Math.random() > 0.97) {
        x += (Math.random() - 0.5) * 8;
        y += (Math.random() - 0.5) * 8;
      }

      // Draw star
      ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
      ctx.beginPath();
      ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
      ctx.fill();

      // Add subtle glow to brighter stars
      if (star.radius > 1.2 && shimmer > 0.75) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, currentRadius * 4);
        gradient.addColorStop(0, `rgba(0, 240, 255, ${currentAlpha * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, currentRadius * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  function drawModernHologram() {
    // Only draw on hero section
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    // Calculate center position (moved down to avoid header cutoff)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 20;

    // Project 3D points to 2D
    const projectedPoints = hologramPoints.map(p => {
      let x = p.x;
      let y = p.y;
      let z = p.z;

      // Apply rotations
      // Rotate Y
      let tempX = x * Math.cos(angleY) - z * Math.sin(angleY);
      let tempZ = x * Math.sin(angleY) + z * Math.cos(angleY);
      x = tempX;
      z = tempZ;

      // Rotate X
      let tempY = y * Math.cos(angleX) - z * Math.sin(angleX);
      tempZ = y * Math.sin(angleX) + z * Math.cos(angleX);
      y = tempY;
      z = tempZ;

      // Rotate Z
      tempX = x * Math.cos(angleZ) - y * Math.sin(angleZ);
      tempY = x * Math.sin(angleZ) + y * Math.cos(angleZ);
      x = tempX;
      y = tempY;

      // Perspective projection
      const perspective = 700 / (700 + z);
      const projX = x * perspective + centerX;
      const projY = y * perspective + centerY;

      // Calculate depth-based alpha
      const depthAlpha = (z + hologramRadius) / (2 * hologramRadius);

      return {
        x: projX,
        y: projY,
        z: z,
        alpha: depthAlpha,
        originalIndex: p.originalIndex
      };
    });

    // Sort by depth
    projectedPoints.sort((a, b) => a.z - b.z);

    // Draw connections with gradient
    for (let i = 0; i < projectedPoints.length; i++) {
      for (let j = i + 1; j < projectedPoints.length; j++) {
        const dx = projectedPoints[i].x - projectedPoints[j].x;
        const dy = projectedPoints[i].y - projectedPoints[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 55) {
          const opacity = 0.15 * (1 - distance / 55);
          const gradient = ctx.createLinearGradient(
            projectedPoints[i].x, projectedPoints[i].y,
            projectedPoints[j].x, projectedPoints[j].y
          );
          gradient.addColorStop(0, `rgba(0, 240, 255, ${opacity * projectedPoints[i].alpha})`);
          gradient.addColorStop(1, `rgba(0, 153, 255, ${opacity * projectedPoints[j].alpha})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(projectedPoints[i].x, projectedPoints[i].y);
          ctx.lineTo(projectedPoints[j].x, projectedPoints[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw points with enhanced glow
    projectedPoints.forEach(p => {
      const size = 1.2 + p.alpha * 2.5;
      const glowSize = size * 4;

      // Glitch effect
      let x = p.x;
      let y = p.y;
      if (glitchActive && Math.random() > 0.92) {
        x += (Math.random() - 0.5) * 15;
        y += (Math.random() - 0.5) * 15;
      }

      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
      gradient.addColorStop(0, `rgba(0, 240, 255, ${p.alpha * 0.6})`);
      gradient.addColorStop(0.5, `rgba(0, 240, 255, ${p.alpha * 0.2})`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Core point
      ctx.beginPath();
      ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
      ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawModernStarfield();
    drawModernHologram();

    // Smooth rotation
    angleY += 0.0015;
    angleX += 0.0008;
    angleZ += 0.0004;

    // Random glitch effect
    glitchTimer++;
    if (glitchTimer > 400 && Math.random() > 0.985) {
      glitchActive = true;
      glitchTimer = 0;
      setTimeout(() => { glitchActive = false; }, 80);
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', setup);
  setup();
  animate();
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all animated elements
  const animatedElements = document.querySelectorAll('.fade-in-scroll, .content-block, .glitch-statement, .bio-statement, .dimensional-statement, .character-card, .prison-statement, .resource-statement, .question-mark, .final-description, .pitch-grid, .cta-section, .final-quote, .quote-block, .bio-note, .layer-grid, .data-grid');
  
  animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// INTERACTIVE EFFECTS
// ============================================
function initializeInteractiveEffects() {
  // Enhanced click effects
  document.addEventListener('click', (e) => {
    // Don't create effects on interactive elements
    if (e.target.tagName === 'BUTTON' || 
        e.target.tagName === 'A' || 
        e.target.closest('a') ||
        e.target.closest('button')) {
      return;
    }
    
    createEnhancedParticles(e);
    createModernEnergyWave(e.pageX, e.pageY);
  });
}

function createEnhancedParticles(e) {
  const container = document.getElementById('particles-container');
  if (!container) return;

  // Create burst of particles
  const particleCount = Math.floor(Math.random() * 4) + 3;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = Math.random() * 30 + 20;
    const offsetX = Math.cos(angle) * velocity;
    const offsetY = Math.sin(angle) * velocity;
    
    particle.style.left = e.pageX + 'px';
    particle.style.top = e.pageY + 'px';
    
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    const duration = Math.random() * 800 + 600;
    
    container.appendChild(particle);
    
    // Animate particle
    setTimeout(() => {
      particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      particle.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      if (container.contains(particle)) {
        container.removeChild(particle);
      }
    }, duration + 500);
  }
}

function createModernEnergyWave(x, y) {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const wave = document.createElement('div');
  wave.className = 'energy-wave';
  wave.style.left = (x - 100) + 'px';
  wave.style.top = (y - 100) + 'px';
  
  container.appendChild(wave);
  
  setTimeout(() => {
    if (container.contains(wave)) {
      container.removeChild(wave);
    }
  }, 2500);
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initializeNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initializeSmoothScroll() {
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
}

// ============================================
// ENHANCED RADAR VISUALIZATION
// ============================================
function initializeNestedSpheres() {
  const container = document.getElementById('nested-spheres');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  canvas.style.maxWidth = '600px';
  canvas.style.width = '100%';
  canvas.style.height = 'auto';
  canvas.style.margin = '0 auto';
  canvas.style.display = 'block';
  
  const ctx = canvas.getContext('2d');
  const centerX = 300;
  const centerY = 300;
  
  // Radar circles
  const circles = [
    { r: 250, opacity: 0.3, label: 'Layer ∞' },
    { r: 190, opacity: 0.4, label: 'Layer 3' },
    { r: 130, opacity: 0.5, label: 'Layer 2' },
    { r: 70, opacity: 0.6, label: 'Layer 1' }
  ];
  
  // Targets
  const targets = [];
  for (let i = 0; i < 8; i++) {
    targets.push({
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * 250,
      speed: (Math.random() * 0.002 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 3 + 2,
      pulsePhase: Math.random() * Math.PI * 2
    });
  }
  
  // Sweep angle
  let sweepAngle = 0;
  
  function animate() {
    // Clear with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, 600, 600);
    
    // Draw circles
    circles.forEach((circle, index) => {
      ctx.strokeStyle = `rgba(0, 240, 255, ${circle.opacity * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, circle.r, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw grid lines
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        ctx.strokeStyle = `rgba(0, 240, 255, 0.1)`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * 250,
          centerY + Math.sin(angle) * 250
        );
        ctx.stroke();
      }
    });
    
    // Draw sweep
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 250);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, 250, sweepAngle - 0.3, sweepAngle);
    ctx.closePath();
    ctx.fill();
    
    // Update and draw targets
    targets.forEach(target => {
      // Move target inward
      target.distance -= 0.3;
      if (target.distance < 0) {
        target.distance = 250;
        target.angle = Math.random() * Math.PI * 2;
      }
      
      target.angle += target.speed;
      target.pulsePhase += 0.05;
      
      const x = centerX + Math.cos(target.angle) * target.distance;
      const y = centerY + Math.sin(target.angle) * target.distance;
      const pulse = Math.sin(target.pulsePhase) * 0.5 + 0.5;
      
      // Draw target with glow
      ctx.fillStyle = `rgba(255, 50, 50, ${0.8 * pulse})`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255, 50, 50, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, target.size * (1 + pulse * 0.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Draw target ring
      ctx.strokeStyle = `rgba(255, 100, 100, ${0.6 * pulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, target.size * 2 * (1 + pulse * 0.3), 0, Math.PI * 2);
      ctx.stroke();
    });
    
    // Center dot
    ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    sweepAngle += 0.02;
    requestAnimationFrame(animate);
  }
  
  container.appendChild(canvas);
  animate();
}

// Initialize nested spheres when section comes into view
const nestingSection = document.getElementById('nesting');
if (nestingSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initializeNestedSpheres();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(nestingSection);
}

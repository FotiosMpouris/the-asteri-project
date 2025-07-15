// =================================================================
// THE ASTERI PROJECT - SCRIPT.JS - V2.0
// Replaced Matrix Rain with an Interactive Constellation Field background.
// =================================================================

// Keep a reference to the background animation to stop it when the game starts.
window.backgroundAnimationId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the new background effect
  initializeConstellationEffect();

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
// NEW INTERACTIVE CONSTELLATION EFFECT
// =================================================================
function initializeConstellationEffect() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  const starCount = window.innerWidth < 768 ? 100 : 200; // Fewer stars on mobile
  const mouse = {
    x: undefined,
    y: undefined,
    radius: 150 // Area of interaction around the mouse
  };

  function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 1, // Stars with different sizes
        baseAlpha: Math.random() * 0.5 + 0.5, // Each star has a base brightness
        alpha: 0
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      // Pulsing effect
      star.alpha = star.baseAlpha * (Math.sin(Date.now() * 0.001 + star.x) * 0.5 + 0.5);
      ctx.fillStyle = `rgba(0, 240, 255, ${star.alpha})`; // Use accent glow color
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    connect();
  }
  
  function connect() {
    for (let a = 0; a < stars.length; a++) {
        // Connect stars to other nearby stars
        for (let b = a; b < stars.length; b++) {
            let dx = stars[a].x - stars[b].x;
            let dy = stars[a].y - stars[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) { // Max distance to connect stars
                let opacity = 1 - (distance / 120);
                ctx.strokeStyle = `rgba(0, 123, 255, ${opacity * 0.5})`; // Use accent blue
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(stars[a].x, stars[a].y);
                ctx.lineTo(stars[b].x, stars[b].y);
                ctx.stroke();
            }
        }
        
        // Connect stars to the mouse
        if(mouse.x !== undefined && mouse.y !== undefined) {
             let dxMouse = stars[a].x - mouse.x;
             let dyMouse = stars[a].y - mouse.y;
             let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
             if(distanceMouse < mouse.radius) {
                let opacity = 1 - (distanceMouse / mouse.radius);
                ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`; // Brighter connection to mouse
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

  // Event Listeners
  window.addEventListener('resize', setupCanvas);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
   window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  setupCanvas();
  animate();
}


// =================================================================
// GAME LOGIC (UNCHANGED MECHANICS, BUT NOW STOPS THE NEW BACKGROUND)
// =================================================================
function startGame() {
  // Stop the background animation
  if (window.backgroundAnimationId) {
    cancelAnimationFrame(window.backgroundAnimationId);
  }

  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) {
    alert("Error: Game canvas not found!");
    return;
  }
  const ctx = canvas.getContext('2d');

  // Hide other sections when game starts
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });

  // Ensure canvas is visible and sized correctly for the game
  canvas.style.display = 'block';
  canvas.width = 800;
  canvas.height = 500; // Game uses a fixed size

  let player = { x: 400, y: 450, width: 30, height: 30, speed: 5, lives: 5, hitTime: 0 };
  let bullets = [];
  let enemyBullets = [];
  let enemies = [];
  let score = 0;
  let timeLeft = 60;
  let lastFire = 0;
  let wave = 1;
  let gameActive = true;
  const keys = {};

  // --- Start of unmodified game functions ---
  function spawnEnemyWave() {
    if (!gameActive) return;
    const enemyCount = wave * 2;
    const spacing = 800 / (enemyCount + 1);
    for (let i = 0; i < enemyCount; i++) {
      const x = (i + 1) * spacing + (Math.random() * 40 - 20);
      enemies.push({
        x: Math.max(20, Math.min(780, x)),
        y: -30 - Math.random() * 50,
        width: 25,
        height: 25,
        speed: 0.6 + wave * 0.15,
      });
    }
    wave++;
  }

  setTimeout(spawnEnemyWave, 1000);
  const waveInterval = setInterval(spawnEnemyWave, 6000);

  function gameLoop() {
    if (!gameActive) {
      clearInterval(waveInterval);
      return;
    }

    ctx.fillStyle = "rgba(10, 25, 47, 0.2)"; // Use the site's dark blue for trails
    ctx.fillRect(0, 0, 800, 500);

    ctx.save();
    if (player.hitTime > 0) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "red";
      player.hitTime -= (1 / 60);
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - player.height / 2);
    ctx.lineTo(player.x - player.width / 2, player.y + player.height / 2);
    ctx.lineTo(player.x + player.width / 2, player.y + player.height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    if (keys['ArrowLeft'] && player.x - player.width / 2 > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x + player.width / 2 < 800) player.x += player.speed;
    if (keys[' '] && Date.now() - lastFire > 180) {
      bullets.push({ x: player.x, y: player.y - player.height / 2, dy: -6 });
      lastFire = Date.now();
    }

    ctx.fillStyle = '#00f0ff'; // Player bullets
    bullets = bullets.filter(b => b.y > -10);
    bullets.forEach(b => {
      ctx.fillRect(b.x - 2, b.y - 5, 4, 10);
      b.y += b.dy;
    });

    ctx.fillStyle = '#FF5733'; // Enemy bullets
    enemyBullets = enemyBullets.filter(eb => eb.y < 510);
    enemyBullets.forEach(eb => {
      ctx.fillRect(eb.x - 2, eb.y, 4, 8);
      eb.y += 3;
      if (player.hitTime <= 0 && eb.x > player.x - player.width/2 && eb.x < player.x + player.width/2 && eb.y > player.y - player.height/2 && eb.y < player.y + player.height/2) {
        player.lives--;
        player.hitTime = 1.0;
        enemyBullets.splice(enemyBullets.indexOf(eb), 1);
        if (player.lives <= 0) {
          gameActive = false;
          endGame('SIMULATION FAILED! Score: ' + score);
        }
      }
    });

    enemies.forEach((e, eIndex) => {
        if (Math.random() < 0.002) {
             enemyBullets.push({ x: e.x, y: e.y + e.height / 2 });
        }
    });

    ctx.fillStyle = '#A020F0'; // Enemies
    enemies = enemies.filter(e => e.y < 520);
    enemies.forEach((e, eIndex) => {
      e.y += e.speed;
      ctx.fillRect(e.x - e.width / 2, e.y - e.height / 2, e.width, e.height);

      bullets.forEach((b, bIndex) => {
        if (b.x > e.x - e.width / 2 && b.x < e.x + e.width / 2 && b.y < e.y + e.height / 2 && b.y > e.y - e.height / 2) {
          score += 10 * wave;
          enemies.splice(eIndex, 1);
          bullets.splice(bIndex, 1);
        }
      });

      if (player.hitTime <= 0 && e.x + e.width / 2 > player.x - player.width / 2 && e.x - e.width / 2 < player.x + player.width / 2 && e.y + e.height / 2 > player.y - player.height / 2 && e.y - e.height / 2 < player.y + player.height / 2) {
        player.lives--;
        player.hitTime = 1.0;
        enemies.splice(eIndex, 1);
        if (player.lives <= 0) {
          gameActive = false;
          endGame('SIMULATION FAILED! Score: ' + score);
        }
      }
    });
    
    // HUD
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 240, 255, 0.7)';
    ctx.fillRect(10, 10, 200, 90);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
    ctx.font = '18px "Courier New", Courier, monospace';
    ctx.fillText('Score: ' + score, 20, 35);
    ctx.fillText('Lives: ' + player.lives, 20, 60);
    ctx.fillText('Time:  ' + Math.ceil(timeLeft), 20, 85);
    ctx.restore();

    if (timeLeft > 0) {
      timeLeft -= (1 / 60);
    } else if (gameActive) {
      gameActive = false;
      endGame('SIMULATION COMPLETE! Score: ' + score);
    }
    if (gameActive) requestAnimationFrame(gameLoop);
  }

  function endGame(message) {
    gameActive = false;
    // Important: Re-initialize the background effect when the game ends
    initializeConstellationEffect();
    document.querySelectorAll('.section').forEach(section => section.style.display = 'flex'); // Use flex to match CSS
    
    const popup = document.createElement('div');
    popup.className = 'game-popup';
    popup.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(10, 25, 47, 0.95); color: white; padding: 30px; border-radius: 10px; z-index: 1001; text-align: center; font-size: 1.5rem; border: 1px solid var(--accent-blue); box-shadow: 0 0 20px rgba(0, 123, 255, 0.5);`;
    popup.innerHTML = `${message}<br><button id="replay-btn" style="margin-top: 20px; margin-right: 15px; padding: 8px 15px; background: var(--accent-blue); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">Replay</button><button id="ok-btn" style="margin-top: 20px; padding: 8px 15px; background: #555; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">OK</button>`;
    document.body.appendChild(popup);
    
    popup.addEventListener('click', (e) => {
      if (e.target.id === 'replay-btn') {
        popup.remove();
        startGame();
      } else if (e.target.id === 'ok-btn') {
        popup.remove();
      }
    });
  }

  document.addEventListener('keydown', (e) => { keys[e.key] = true; });
  document.addEventListener('keyup', (e) => { keys[e.key] = false; });
  gameLoop();
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

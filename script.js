function initializeMatrixEffect() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return; // Exit if canvas doesn't exist
  const ctx = canvas.getContext('2d');
  canvas.width = 800; // Fixed size for game
  canvas.height = 500;
  const letters = Array(256).join("0").split("");

  // Make drawMatrix accessible globally for the game - NOTE: Check if this global exposure is truly needed by the game loop.
  // The provided startGame() includes its own drawMatrixRain which seems more appropriate. Let's comment out the global assignment for now.
  // window.drawMatrix = function() { ... };
  // If the game *needs* this specific global function, uncomment it.

  // Local matrix drawing function for background before game starts
  function drawBackgroundMatrix() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f0"; // Classic green matrix rain
      letters.forEach((y_pos, index) => {
          const text = String.fromCharCode(3e4 + Math.random() * 33);
          const x_pos = index * 10;
          ctx.fillText(text, x_pos, y_pos);
          if (y_pos > 100 + Math.random() * 1e5) letters[index] = 0;
          else letters[index] = y_pos + 10;
      });
  }
  // Store interval ID to clear it later if needed
  window.backgroundMatrixInterval = setInterval(drawBackgroundMatrix, 50);


  window.addEventListener('resize', () => {
    // Keep canvas fixed for the game area
    canvas.width = 800;
    canvas.height = 500;
  });
}

function startGame() {
  const canvas = document.getElementById('matrix-canvas');
   if (!canvas) {
       alert("Error: Game canvas not found!");
       return;
   }
  const ctx = canvas.getContext('2d');
  const sections = document.querySelectorAll('.section');
  // Hide other sections when game starts - adjust selector if needed
  sections.forEach(section => {
      if (section.id !== 'game-container') { // Assuming game canvas might be wrapped or needs special handling
         section.style.display = 'none';
      }
  });

  // Ensure canvas is visible and sized correctly
  canvas.style.display = 'block'; // Make sure it's visible
  canvas.width = 800;
  canvas.height = 500;

  // Clear the background interval if it exists
  if (window.backgroundMatrixInterval) {
      clearInterval(window.backgroundMatrixInterval);
  }


  let player = { x: 400, y: 450, width: 30, height: 30, speed: 5, lives: 5, hitTime: 0 };
  let bullets = [];
  let enemyBullets = [];
  let enemies = [];
  let score = 0;
  let timeLeft = 60;
  let lastFire = 0;
  let lastEnemyFire = 0;
  let wave = 1;
  let gameActive = true;
  const keys = {};
  let letters = Array(150).join("0").split(""); // For in-game matrix rain

  // In-Game Matrix Rain
  function drawMatrixRain() {
    if (!gameActive) return;
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // Adjust alpha for visibility
    ctx.fillRect(0, 0, 800, 500);
    ctx.fillStyle = "rgba(0, 255, 100, 0.5)"; // Slightly different green, semi-transparent
    ctx.font = '10px monospace'; // Use monospace for grid effect
    letters.forEach((y_pos, index) => {
      const text = String.fromCharCode(0x30A0 + Math.random() * 96); // Katakana range often used
      const x_pos = index * 10;
      ctx.fillText(text, x_pos, y_pos);
      // Increase fall speed slightly
      letters[index] = (y_pos > 500 + Math.random() * 5000) ? 0 : y_pos + 12;
    });
  }

  // Stop any previous game matrix rain interval
   if (window.drawMatrixInterval) {
        clearInterval(window.drawMatrixInterval);
    }
  window.drawMatrixInterval = setInterval(drawMatrixRain, 60); // Adjusted interval

  function spawnEnemyWave() {
    if (!gameActive) return;
      const enemyCount = wave * 2;
      const spacing = 800 / (enemyCount + 1);
      for (let i = 0; i < enemyCount; i++) {
        const x = (i + 1) * spacing + (Math.random() * 40 - 20); // Slightly more variation
        enemies.push({
          x: Math.max(20, Math.min(780, x)),
          y: -30 - Math.random() * 50, // Start further off-screen
          width: 25, // Slightly larger enemies
          height: 25,
          speed: 0.6 + wave * 0.15, // Slightly faster scaling
          type: Math.random() > 0.7 ? 'shooter' : 'basic', // Add enemy types potentially
        });
      }
      wave++;
  }

  // Use setTimeout for first wave, then setInterval
  setTimeout(spawnEnemyWave, 1000);
  const waveInterval = setInterval(spawnEnemyWave, 6000); // Longer interval between waves

  function gameLoop() {
    if (!gameActive) {
         clearInterval(window.drawMatrixInterval); // Stop rain when game ends
         clearInterval(waveInterval); // Stop spawning enemies
         return;
    }

    // Clear canvas (now handled by drawMatrixRain's fillRect)
    // ctx.clearRect(0, 0, 800, 500);
    drawMatrixRain(); // Draw rain first as background

    // Player Ship (Triangle with glow on hit)
    ctx.save(); // Save context state
    if (player.hitTime > 0) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "red";
      player.hitTime -= (1 / 60); // Assuming 60fps
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
    ctx.restore(); // Restore context state (removes shadow effect for subsequent draws)


    // Move Player
    if (keys['ArrowLeft'] && player.x - player.width / 2 > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x + player.width / 2 < 800) player.x += player.speed;
    // Fire Bullet
    if (keys[' '] && Date.now() - lastFire > 180) { // Slightly faster fire rate
      bullets.push({ x: player.x, y: player.y - player.height / 2, dy: -6 }); // Faster bullets
      lastFire = Date.now();
    }

    // Update & Draw Player Bullets
    ctx.fillStyle = '#00f0ff'; // Cyan bullets
    bullets = bullets.filter(b => b.y > -10); // Remove slightly off-screen
    bullets.forEach(b => {
      ctx.fillRect(b.x - 2, b.y - 5, 4, 10);
      b.y += b.dy;
    });

    // Update & Draw Enemy Bullets
    ctx.fillStyle = '#FF5733'; // Orange enemy bullets for contrast
    enemyBullets = enemyBullets.filter(eb => eb.y < 510); // Remove slightly off-screen
    enemyBullets.forEach(eb => {
      ctx.fillRect(eb.x - 2, eb.y, 4, 8); // Slightly smaller enemy bullets
      eb.y += eb.dy;
      // Collision with Player
      if (player.hitTime <= 0 && // Check for invulnerability period
          eb.x > player.x - player.width / 2 && eb.x < player.x + player.width / 2 &&
          eb.y > player.y - player.height / 2 && eb.y < player.y + player.height / 2)
       {
        player.lives--;
        player.hitTime = 1.0; // 1 second invulnerability
        enemyBullets.splice(enemyBullets.indexOf(eb), 1); // Remove bullet
        if (player.lives <= 0) {
          gameActive = false;
          endGame('Game Over! Score: ' + score);
        }
      }
    });

    // Update & Draw Enemies
    ctx.fillStyle = '#A020F0'; // Purple enemies
    enemies = enemies.filter(e => e.y < 520); // Remove when further off-screen
    enemies.forEach((e, eIndex) => {
      e.y += e.speed;
      // Simple square enemy for now
      ctx.fillRect(e.x - e.width / 2, e.y - e.height / 2, e.width, e.height);
       // Tentacles (optional visual)
       /*
       ctx.strokeStyle = '#A020F0';
       ctx.lineWidth = 2;
       ctx.beginPath();
       ctx.moveTo(e.x - e.width / 4, e.y + e.height / 2);
       ctx.lineTo(e.x - e.width / 4, e.y + e.height);
       ctx.moveTo(e.x + e.width / 4, e.y + e.height / 2);
       ctx.lineTo(e.x + e.width / 4, e.y + e.height);
       ctx.stroke();
       */

      // Enemy Firing Logic
      if (e.type === 'shooter' && Date.now() - lastEnemyFire > 1200 && Math.random() < 0.05) { // Shooters fire more often
        enemyBullets.push({ x: e.x, y: e.y + e.height / 2, dy: 4 }); // Fire from center
        lastEnemyFire = Date.now();
      } else if (e.type === 'basic' && Date.now() - lastEnemyFire > 1500 && Math.random() < 0.015) { // Basic enemies fire rarely
         enemyBullets.push({ x: e.x, y: e.y + e.height / 2, dy: 3 });
         lastEnemyFire = Date.now();
      }


      // Collision: Player Bullets vs Enemies
      bullets.forEach((b, bIndex) => {
        if (b.x > e.x - e.width / 2 && b.x < e.x + e.width / 2 &&
            b.y < e.y + e.height / 2 && b.y > e.y - e.height / 2)
        {
          score += 10 * wave; // Score scales with wave
          enemies.splice(eIndex, 1); // Remove enemy
          bullets.splice(bIndex, 1); // Remove bullet
          // Add explosion effect here later if desired
        }
      });

      // Collision: Enemies vs Player
       if (player.hitTime <= 0 && // Check invulnerability
           e.x + e.width / 2 > player.x - player.width / 2 &&
           e.x - e.width / 2 < player.x + player.width / 2 &&
           e.y + e.height / 2 > player.y - player.height / 2 &&
           e.y - e.height / 2 < player.y + player.height / 2)
       {
        player.lives--;
        player.hitTime = 1.0; // Invulnerability
        enemies.splice(eIndex, 1); // Remove enemy
        if (player.lives <= 0) {
          gameActive = false;
          endGame('Game Over! Score: ' + score);
        }
      }
    });

    // Enhanced Scoreboard
    ctx.save()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black background
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 255, 100, 0.7)'; // Match matrix rain color
    ctx.fillRect(10, 10, 200, 90); // Adjusted size
    ctx.shadowBlur = 0; // Turn off shadow for text
    ctx.fillStyle = 'rgba(0, 255, 100, 0.9)'; // Bright green text
    ctx.font = '18px "Courier New", Courier, monospace'; // Monospace font
    ctx.fillText('Score: ' + score, 20, 35);
    ctx.fillText('Lives: ' + player.lives, 20, 60);
    ctx.fillText('Time:  ' + Math.ceil(timeLeft), 20, 85); // Use Math.ceil for cleaner display
    ctx.restore();

    // Timer Countdown
    if (timeLeft > 0) {
         timeLeft -= (1/60); // Decrement time based on assumed 60fps frame rate
    } else if (gameActive) { // Check gameActive ensures this only runs once
      gameActive = false;
      endGame('Victory! Score: ' + score);
    }

    if (gameActive) requestAnimationFrame(gameLoop); // Continue loop if active
  }

  function endGame(message) {
    clearInterval(window.drawMatrixInterval); // Stop matrix rain specifically for the game
    clearInterval(waveInterval); // Stop spawning enemies
    gameActive = false; // Explicitly set game to inactive

    // Restart background matrix effect
    initializeMatrixEffect();

    // Show other sections again
    sections.forEach(section => section.style.display = 'block');

    // Remove any existing popup first
    const existingPopup = document.querySelector('.game-popup');
    if (existingPopup) existingPopup.remove();

    // Create and display popup
    const popup = document.createElement('div');
    popup.className = 'game-popup';
    // Inherit styles from CSS, maybe add slight adjustments if needed
    popup.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: rgba(10, 25, 47, 0.95); color: white; padding: 30px;
        border-radius: 10px; z-index: 1001; text-align: center;
        font-size: 1.5rem; border: 1px solid var(--accent-blue);
        box-shadow: 0 0 20px rgba(0, 123, 255, 0.5);
    `;
    popup.innerHTML = `${message} <br>
      <button id="replay-btn" style="margin-top: 20px; margin-right: 15px; padding: 8px 15px; background: var(--accent-blue); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">Replay</button>
      <button id="ok-btn" style="margin-top: 20px; padding: 8px 15px; background: #555; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">OK</button>`;
    document.body.appendChild(popup);

    // Event delegation for buttons within the popup
    popup.addEventListener('click', (e) => {
      if (e.target.id === 'replay-btn') {
        popup.remove();
        startGame(); // Restart the game
      } else if (e.target.id === 'ok-btn') {
        popup.remove();
        // Optionally reload or just hide canvas and show sections
         const canvas = document.getElementById('matrix-canvas');
         if (canvas) canvas.style.display = 'block'; // Or adjust as needed, maybe just stop drawing on it
         sections.forEach(section => section.style.display = 'block'); // Ensure sections are visible
         // window.location.reload(); // Avoid reload unless necessary
      }
    });
  }

  // Remove the mobile check previously here
  // document.querySelector('button[onclick="startGame()"]').addEventListener('click', (e) => { ... });

  // Keyboard event listeners
  document.addEventListener('keydown', (e) => { keys[e.key] = true; });
  document.addEventListener('keyup', (e) => { keys[e.key] = false; });

  // Start the game loop
  gameLoop();
}


/* Particle Effects */
function createParticle(e) {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const particle = document.createElement('div');
  particle.className = 'particle';
  // Make particles originate slightly offset for better visibility
  particle.style.left = (e.pageX + (Math.random() * 10 - 5)) + 'px';
  particle.style.top = (e.pageY + (Math.random() * 10 - 5)) + 'px';

  // Randomize size and duration slightly
  const size = Math.random() * 3 + 1; // 1px to 4px size
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  const duration = Math.random() * 1000 + 1000; // 1s to 2s life

  container.appendChild(particle);

  setTimeout(() => {
    // Fade out effect could be added via CSS animation toggling a class
    particle.style.opacity = '0';
    setTimeout(() => { // Remove after fade out
         if (container.contains(particle)) { // Check if still exists
            container.removeChild(particle);
         }
    }, 500); // Match fade-out duration if added
  }, duration);
}

function createEnergyWave(x, y) {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const wave = document.createElement('div');
  wave.className = 'energy-wave';
  // Center the wave on the click point
  wave.style.left = (x - 100) + 'px'; // Assuming 200px width
  wave.style.top = (y - 100) + 'px'; // Assuming 200px height
  container.appendChild(wave);

  // Remove after animation duration (defined in CSS @keyframes ripple)
  setTimeout(() => {
     if (container.contains(wave)) {
        container.removeChild(wave);
     }
  }, 3000); // Match CSS animation duration or slightly longer
}

/* Mobile Nav Toggles */
function setupMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  // Removed projects toggle button references as the dropdown is gone

  if (!hamburger || !mobileMenu) return;

  // Ensure menu is closed initially
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('active'); // Optional: Add active state for X transform

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent click from propagating to document listener
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active'); // Toggle active state for X animation if added in CSS
  });

  // Close menu if clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });

   // Close menu if a link is clicked
   mobileMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
          mobileMenu.classList.remove('open');
          hamburger.classList.remove('active');
      }
   });
}


function handleScroll() {
  const hamburger = document.getElementById('hamburger');
  const navbar = document.querySelector('.navbar'); // Target navbar for background change
  if (!navbar) return; // Add check for navbar too

  if (window.scrollY > 50) {
    navbar.classList.add('scrolled'); // Add class to navbar for potential background change
    if (hamburger) hamburger.classList.add('scrolled'); // Keep hamburger color change if desired
  } else {
    navbar.classList.remove('scrolled');
    if (hamburger) hamburger.classList.remove('scrolled');
  }
}

/* Initialize everything on DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize background matrix effect ONLY if not starting game immediately
  // The game itself handles the canvas
  if (!document.getElementById('game-container')) { // Check if we are on a page where the game might auto-start
      initializeMatrixEffect();
  }

  // Click effects listener
  document.addEventListener('click', (e) => {
      // Avoid creating effects if clicking on interactive elements like buttons or links?
      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
        createParticle(e);
        createEnergyWave(e.pageX, e.pageY);
      }
  });

  setupMobileNav();
  window.addEventListener('scroll', handleScroll);

  // Add listener for the game start button AFTER the DOM is loaded
  const startGameButton = document.querySelector('button[onclick="startGame()"]');
  if (startGameButton) {
      startGameButton.addEventListener('click', (e) => {
          // Removed the mobile check alert previously here.
          // If you want to prevent game on mobile, add check here:
          // if (/Mobi|Android/i.test(navigator.userAgent)) {
          //    alert("Simulation requires desktop hardware.");
          //    e.preventDefault(); // Prevent startGame() call
          //    return;
          // }
          // startGame() is called via the inline onclick attribute
      });
  }
});

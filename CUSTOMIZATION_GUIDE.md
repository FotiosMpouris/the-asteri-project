# CUSTOMIZATION GUIDE
## Easy Tweaks for The Asteri Project Website

---

## 🎨 COLOR CHANGES

### Location: `style.css` (Lines 8-16)

```css
:root {
  --primary-dark: #0a0e1a;      /* Main background color */
  --primary-deep: #000000;       /* Pure black sections */
  --accent-blue: #007BFF;        /* Secondary accent */
  --accent-cyan: #00f0ff;        /* Main glow color */
  --text-primary: #e6e9f0;       /* Main text */
  --text-secondary: #8892b0;     /* Body text */
  --text-dim: #4a5568;           /* Technical readouts */
}
```

**Examples:**
- Want brighter cyan? Change `#00f0ff` to `#00ffff`
- Want darker background? Change `#0a0e1a` to `#000000`
- Want different accent? Change `#007BFF` to your color

---

## ⭐ STARFIELD ADJUSTMENTS

### Location: `script.js` (Line 29)

```javascript
const starCount = window.innerWidth < 768 ? 200 : 400;
```

**To change star density:**
- More stars: `200 : 600` (mobile : desktop)
- Fewer stars: `100 : 200`

### Location: `script.js` (Lines 47-48)

```javascript
radius: Math.random() * 1.5 + 0.3,
alpha: Math.random() * 0.7 + 0.3,
```

**To change star appearance:**
- Bigger stars: Change `1.5` to `2.5`
- Brighter stars: Change `0.7` to `1.0`
- Dimmer stars: Change `0.3` to `0.1`

---

## 🌐 HOLOGRAM SPHERE

### Location: `script.js` (Line 34)

```javascript
const numHologramPoints = 300;
```

**To change sphere density:**
- More detailed: `400` or `500`
- Less detailed: `200` or `150`
- Performance issues? Try `150`

### Location: `script.js` (Lines 123-125)

```javascript
angleY += 0.002;  // Horizontal rotation speed
angleX += 0.001;  // Vertical rotation speed
angleZ += 0.0005; // Depth rotation speed
```

**To change rotation speed:**
- Faster: Increase values (e.g., `0.004`)
- Slower: Decrease values (e.g., `0.001`)
- Stop rotation: Set to `0`

---

## 🎬 VIDEO ADJUSTMENTS

### Video Opacity
**Location: `style.css` (Line 115)**

```css
.background-video {
  opacity: 0.3;  /* 30% visible */
}
```

**Change visibility:**
- More visible: `0.5` (50%)
- Less visible: `0.2` (20%)
- Almost invisible: `0.1` (10%)

### Video Overlay Darkness
**Location: `style.css` (Lines 120-127)**

```css
.video-overlay {
  background: rgba(0, 0, 0, 0.7);  /* 70% dark */
}

.video-overlay.dark {
  background: rgba(0, 0, 0, 0.8);  /* 80% dark */
}
```

**Adjust darkness:**
- Lighter: `0.5` (50% dark)
- Darker: `0.9` (90% dark)

---

## 📝 TEXT SIZES

### Main Title
**Location: `style.css` (Line 139)**

```css
.main-title {
  font-size: clamp(2.5rem, 8vw, 6rem);
}
```

**Format:** `clamp(min, preferred, max)`
- Bigger: `clamp(3rem, 10vw, 8rem)`
- Smaller: `clamp(2rem, 6vw, 4rem)`

### Section Titles
**Location: `style.css` (Line 188)**

```css
.section-title {
  font-size: clamp(1.8rem, 5vw, 3.5rem);
}
```

### Body Text
**Location: `style.css` (Line 260)**

```css
.content-block p {
  font-size: clamp(1rem, 2.5vw, 1.3rem);
}
```

---

## ⚡ GLITCH EFFECTS

### Glitch Frequency
**Location: `script.js` (Line 127)**

```javascript
if (glitchTimer > 300 && Math.random() > 0.98) {
```

**To change frequency:**
- More frequent: `glitchTimer > 200` or `Math.random() > 0.95`
- Less frequent: `glitchTimer > 500` or `Math.random() > 0.99`
- Disable: Comment out the entire if block

### Glitch Duration
**Location: `script.js` (Line 130)**

```javascript
setTimeout(() => { glitchActive = false; }, 100);
```

**To change duration:**
- Longer glitch: `200` (200ms)
- Shorter glitch: `50` (50ms)

---

## 💫 PARTICLE EFFECTS

### Particle Count
**Location: `script.js` (Line 184)**

```javascript
const particleCount = Math.random() * 3 + 2;
```

**To change particles per click:**
- More particles: `Math.random() * 5 + 3` (3-8 particles)
- Fewer particles: `Math.random() * 2 + 1` (1-3 particles)

### Particle Size
**Location: `script.js` (Line 194)**

```javascript
const size = Math.random() * 4 + 1;
```

**To change size:**
- Bigger: `Math.random() * 6 + 2`
- Smaller: `Math.random() * 2 + 0.5`

### Particle Lifetime
**Location: `script.js` (Line 197)**

```javascript
const duration = Math.random() * 1000 + 1000;
```

**To change how long they last:**
- Longer: `Math.random() * 2000 + 2000` (2-4 seconds)
- Shorter: `Math.random() * 500 + 500` (0.5-1 seconds)

---

## 🎭 ANIMATION SPEEDS

### Scroll Fade-In Speed
**Location: `style.css` (Line 255)**

```css
.content-block {
  transition: opacity 0.8s ease, transform 0.8s ease;
}
```

**To change speed:**
- Faster: `0.4s` (400ms)
- Slower: `1.2s` (1200ms)

### Button Hover Speed
**Location: `style.css` (Line 103)**

```css
.cta-button {
  transition: var(--transition);  /* 0.3s */
}
```

**To change:** Edit the `--transition` variable at top of CSS:
```css
--transition: all 0.5s ease;  /* Slower */
```

---

## 📱 MOBILE BREAKPOINTS

### Location: `style.css` (Line 883)

```css
@media (max-width: 768px) {
  /* Tablet/mobile styles */
}
```

**To change when mobile kicks in:**
- Earlier: `@media (max-width: 992px)`
- Later: `@media (max-width: 600px)`

---

## 🎯 SECTION SPACING

### Vertical Padding
**Location: `style.css` (Line 108)**

```css
.section {
  padding: 6rem 2rem;
}
```

**To change spacing:**
- More space: `8rem 2rem`
- Less space: `4rem 2rem`
- Mobile: Edit at line 893

### Content Width
**Location: `style.css` (Line 113)**

```css
.section-content {
  max-width: 1200px;
}
```

**To change content width:**
- Wider: `1400px`
- Narrower: `1000px`

---

## 🔤 FONTS

### Main Font
**Location: `style.css` (Line 23)**

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...
```

**To use custom font:**
1. Add font import at top of CSS:
```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
```

2. Change font-family:
```css
font-family: 'Orbitron', sans-serif;
```

### Technical Readouts Font
**Location: `style.css` (Line 151)**

```css
font-family: 'Courier New', monospace;
```

**Popular monospace alternatives:**
- `'Roboto Mono', monospace`
- `'Fira Code', monospace`
- `'Source Code Pro', monospace`

---

## 🎨 GLOW EFFECTS

### Text Glow Intensity
**Location: `style.css` (Line 141)**

```css
text-shadow: 0 0 30px var(--glow-cyan);
```

**To change glow:**
- Stronger: `0 0 50px var(--glow-cyan)`
- Weaker: `0 0 15px var(--glow-cyan)`
- Multiple glows: `0 0 20px var(--glow-cyan), 0 0 40px var(--glow-blue)`

### Button Glow
**Location: `style.css` (Line 105)**

```css
box-shadow: 0 0 20px var(--glow-cyan);
```

---

## 🌊 ENERGY WAVE EFFECTS

### Wave Size
**Location: `style.css` (Lines 78-79)**

```css
width: 200px;
height: 200px;
```

**To change size:**
- Bigger waves: `300px`
- Smaller waves: `150px`

### Wave Duration
**Location: `style.css` (Line 77)**

```css
animation: ripple 3s ease-out forwards;
```

**To change speed:**
- Faster: `2s`
- Slower: `4s`

---

## 🎯 QUICK PRESETS

### "Subtle Mode" (Less Intense)
```css
/* In style.css */
--accent-cyan: #0099cc;  /* Dimmer cyan */
.background-video { opacity: 0.2; }  /* Less visible videos */
.main-title { text-shadow: 0 0 15px var(--glow-cyan); }  /* Less glow */
```

```javascript
// In script.js
const starCount = 150 : 300;  // Fewer stars
const numHologramPoints = 200;  // Simpler sphere
```

### "Maximum Impact" (More Intense)
```css
/* In style.css */
--accent-cyan: #00ffff;  /* Brighter cyan */
.background-video { opacity: 0.4; }  /* More visible videos */
.main-title { text-shadow: 0 0 50px var(--glow-cyan); }  /* More glow */
```

```javascript
// In script.js
const starCount = 300 : 600;  // More stars
const numHologramPoints = 400;  // Detailed sphere
```

### "Performance Mode" (Faster Loading)
```javascript
// In script.js
const starCount = 100 : 200;  // Fewer stars
const numHologramPoints = 150;  // Simpler sphere
const particleCount = 1;  // One particle per click
```

```css
/* In style.css - Comment out or remove */
/* .background-video { display: none; } */  /* Disable videos */
```

---

## 🔧 COMMON TWEAKS

### Remove "Under Construction" Feel
✅ Already removed! But if you want to add it back:
```html
<!-- In index.html, inside navbar -->
<div class="construction-notice">UNDER CONSTRUCTION</div>
```

### Change Contact Email
**Location: `index.html` (Line 261)**
```html
<a href="mailto:YOUR-EMAIL@example.com"
```

### Disable Click Effects
**Location: `script.js` (Lines 173-182)**
Comment out the entire click event listener:
```javascript
// document.addEventListener('click', (e) => {
//   ...entire function...
// });
```

### Disable Scroll Animations
**Location: `script.js` (Lines 140-156)**
Comment out `initializeScrollAnimations()` call

---

## 💡 TESTING YOUR CHANGES

After making changes:
1. **Save all files**
2. **Hard refresh browser** (Ctrl+F5 or Cmd+Shift+R)
3. **Check browser console** for errors (F12)
4. **Test on mobile** device or browser dev tools
5. **Scroll through entire page** to see effects

---

## ⚠️ IMPORTANT NOTES

- Always keep backups before major changes
- Test on multiple browsers
- Mobile performance matters - don't overdo effects
- Less is often more with animations
- Readability > visual effects

---

## 🆘 UNDO CHANGES

If something breaks:
1. Check browser console for errors
2. Revert to last working version
3. Comment out your changes to isolate the issue
4. Compare with original files

---

*Remember: The goal is to make minds crawl, not browsers crash. Balance is key.*


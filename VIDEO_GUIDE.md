# VIDEO INTEGRATION GUIDE
## The Asteri Project - Redesigned Website

This document outlines the video requirements for the redesigned single-scroll website.

---

## VIDEO FILES NEEDED

Place all videos in the `/videos/` directory with the following names:

### 1. **hero-background.mp4**
- **Location**: Hero section (top of page)
- **Purpose**: Subtle cosmic/abstract background
- **Recommendations**: 
  - Dark, moody, slow-moving
  - Cosmic phenomena, stars, nebulae
  - Should not distract from text
  - Low contrast preferred
- **Duration**: 10-30 seconds (will loop)
- **Opacity**: Set to 30% with dark overlay

### 2. **glitch-reality.mp4**
- **Location**: "But Something Flickers" section
- **Purpose**: Reality distortion, glitch effects
- **Recommendations**:
  - Visual glitches, static, reality "tears"
  - Flickering, distortion effects
  - Can be more aggressive/noticeable
  - Suggests something wrong with reality
- **Duration**: 5-20 seconds (will loop)
- **Opacity**: Set to 30% with heavy dark overlay (80%)

### 3. **bio-grid.mp4**
- **Location**: "Consciousness as Substrate" section
- **Purpose**: Bio-computing, neural networks
- **Recommendations**:
  - Organic patterns, neural networks
  - Mycelium-like structures
  - Brain/biological computing visuals
  - Pulsing, living patterns
- **Duration**: 10-30 seconds (will loop)
- **Opacity**: Set to 30% with heavy dark overlay (80%)

### 4. **dimensional.mp4**
- **Location**: "The Fermi Solution" section
- **Purpose**: Otherworldly, dimensional effects
- **Recommendations**:
  - Abstract, impossible geometry
  - Dimensional bleeding
  - Lovecraftian/cosmic horror aesthetic
  - Multi-dimensional visuals
- **Duration**: 10-30 seconds (will loop)
- **Opacity**: Set to 30% with medium overlay (70%)

### 5. **nested-spheres.mp4** (OPTIONAL)
- **Location**: "Simulations All the Way Down" section
- **Purpose**: Fractal, recursive visuals
- **Recommendations**:
  - Nested structures
  - Fractal patterns
  - Recursive animations
  - Spheres within spheres
- **Duration**: 10-30 seconds (will loop)
- **Note**: Currently using SVG animation, video is optional enhancement

---

## VIDEO SPECIFICATIONS

### Technical Requirements:
- **Format**: MP4 (H.264 codec recommended)
- **Resolution**: 1920x1080 minimum (4K preferred for quality)
- **File Size**: Keep under 10MB per video for performance
- **Compression**: Medium to high compression (quality vs. file size balance)
- **Audio**: None required (videos are muted)
- **Aspect Ratio**: 16:9 preferred

### Optimization Tips:
1. Use dark/black backgrounds to blend with site theme
2. Avoid bright whites or high contrast (will affect text readability)
3. Subtle movement preferred over aggressive animation
4. Loop seamlessly (first and last frames should match)
5. Consider mobile performance (lower resolution fallbacks if needed)

---

## FALLBACK BEHAVIOR

If videos are not present, the sections will still function properly:
- Background will default to solid dark colors
- Starfield canvas animation will remain visible
- No broken elements or errors
- Text remains fully readable

---

## TESTING READABILITY

After adding videos, test text readability:
1. Check all section titles are clearly visible
2. Verify body text has sufficient contrast
3. Adjust video opacity if needed (in CSS: `.background-video { opacity: X; }`)
4. Adjust overlay darkness if needed (in CSS: `.video-overlay { background: rgba(0, 0, 0, X); }`)

---

## CURRENT VIDEO PLACEHOLDERS

The HTML currently references these video files:
```html
videos/hero-background.mp4
videos/glitch-reality.mp4
videos/bio-grid.mp4
videos/dimensional.mp4
```

If you have different filenames, either:
1. Rename your videos to match these names, OR
2. Update the `<source src="videos/YOUR-FILENAME.mp4">` tags in `index.html`

---

## MOBILE CONSIDERATIONS

Videos will automatically play on mobile devices with these attributes:
- `autoplay` - starts automatically
- `muted` - required for autoplay on mobile
- `loop` - continuous playback
- `playsinline` - prevents fullscreen on iOS

If performance is an issue on mobile, consider:
- Creating lower-resolution versions
- Disabling videos on mobile via CSS media queries
- Using static images as fallback

---

## QUESTIONS?

If you need to adjust:
- Video opacity: Edit `.background-video` in `style.css`
- Overlay darkness: Edit `.video-overlay` in `style.css`
- Video placement: Edit `<video>` tags in `index.html`


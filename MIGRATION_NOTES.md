# MIGRATION NOTES
## Old Files and Cleanup

---

## 🗂️ OLD FILES (No Longer Used)

The following files were part of the old multi-page design and are **no longer used** in the new single-scroll design:

### HTML Files (Can be deleted or archived)
- ❌ `characters.html` - Character info now in Section 7 of `index.html`
- ❌ `simulation.html` - Simulation concepts integrated into multiple sections
- ❌ `pitch.html` - Pitch info now in Section 10 of `index.html`

### Image Files (Optional - keep for reference)
- ⚠️ `images/nested-suns.png` - Not currently used (could be used as fallback)
- ⚠️ `images/simulation-overview.png` - Not currently used (could be used as fallback)
- ✅ `images/asteri-project-logo.png` - **STILL USED** in navbar

### Video Files
- ⚠️ `videos/theasteriproject.mp4` - Not currently used but could be integrated

---

## 🧹 CLEANUP OPTIONS

### Option 1: Delete Old Files (Recommended)
If you're confident in the new design, you can safely delete:
```
characters.html
simulation.html
pitch.html
```

These are completely replaced by the new `index.html`.

### Option 2: Archive Old Files
Create an `_archive/` folder and move old files there:
```
mkdir _archive
move characters.html _archive/
move simulation.html _archive/
move pitch.html _archive/
```

### Option 3: Keep Everything
If you want to keep the old files as reference, just leave them. They won't interfere with the new site.

---

## 📦 WHAT TO KEEP

### Essential Files (DO NOT DELETE)
```
✅ index.html              # New main website
✅ style.css               # New styles
✅ script.js               # New animations
✅ images/asteri-project-logo.png
✅ CNAME                   # For GitHub Pages domain
```

### Documentation (Keep for reference)
```
✅ README.md
✅ QUICK_START.md
✅ SECTION_PREVIEW.md
✅ VIDEO_GUIDE.md
✅ REDESIGN_SUMMARY.md
✅ CUSTOMIZATION_GUIDE.md
✅ STORY_BRIEF.md
✅ MIGRATION_NOTES.md (this file)
```

### Optional Assets
```
⚠️ images/nested-suns.png
⚠️ images/simulation-overview.png
⚠️ videos/theasteriproject.mp4
```

---

## 🔄 INTEGRATING EXISTING VIDEO

If you want to use `theasteriproject.mp4` in the new design:

### Option 1: As Hero Background
Replace in `index.html` (Section 1):
```html
<video class="background-video" autoplay muted loop playsinline>
  <source src="videos/theasteriproject.mp4" type="video/mp4">
</video>
```

### Option 2: As Featured Content
Add a dedicated section in `index.html`:
```html
<section id="featured-video" class="section">
  <div class="section-content">
    <div class="video-showcase">
      <video width="100%" controls>
        <source src="videos/theasteriproject.mp4" type="video/mp4">
      </video>
    </div>
  </div>
</section>
```

---

## 🖼️ INTEGRATING EXISTING IMAGES

The old images (`nested-suns.png`, `simulation-overview.png`) could be used:

### As Section Backgrounds
```css
#nesting {
  background-image: url('../images/nested-suns.png');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
}
```

### As Visual Elements
```html
<div class="visual-element">
  <img src="images/nested-suns.png" alt="Nested Suns Visualization">
</div>
```

### As Fallbacks
If videos don't load, these images could serve as static backgrounds.

---

## 🌐 GITHUB PAGES / HOSTING

### CNAME File
The `CNAME` file is used for custom domain configuration with GitHub Pages.

**Keep this file if:**
- You're using GitHub Pages
- You have a custom domain

**Contents should be:**
```
yourdomain.com
```

**If not using GitHub Pages:**
- You can delete this file
- Or leave it (won't cause issues)

---

## 📁 RECOMMENDED FINAL STRUCTURE

```
the-asteri-project/
├── index.html              # Main site
├── style.css               # Styles
├── script.js               # Scripts
├── CNAME                   # Domain config
├── README.md               # Main documentation
├── QUICK_START.md          # Quick guide
├── SECTION_PREVIEW.md      # Visual guide
├── VIDEO_GUIDE.md          # Video specs
├── REDESIGN_SUMMARY.md     # Technical docs
├── CUSTOMIZATION_GUIDE.md  # Tweaking guide
├── STORY_BRIEF.md          # Story concepts
├── MIGRATION_NOTES.md      # This file
├── images/
│   └── asteri-project-logo.png
├── videos/
│   ├── hero-background.mp4      (add)
│   ├── glitch-reality.mp4       (add)
│   ├── bio-grid.mp4              (add)
│   ├── dimensional.mp4           (add)
│   └── theasteriproject.mp4     (existing)
└── _archive/               (optional)
    ├── characters.html
    ├── simulation.html
    └── pitch.html
```

---

## ⚠️ BEFORE DELETING ANYTHING

1. **Test the new site thoroughly**
2. **Make sure all features work**
3. **Create a backup** of the entire project
4. **Verify you don't need old content**
5. **Check if old files are linked anywhere**

---

## 🔗 LINK CHECKING

The new `index.html` does NOT link to:
- ❌ `characters.html`
- ❌ `simulation.html`
- ❌ `pitch.html`

All navigation is now internal (scroll-based) within the single page.

---

## 🚀 DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] Delete or archive old HTML files
- [ ] Add background videos (or accept placeholders)
- [ ] Update contact email in `index.html`
- [ ] Test on multiple devices
- [ ] Verify all links work
- [ ] Check CNAME file (if using custom domain)
- [ ] Optimize image/video file sizes
- [ ] Test load times
- [ ] Verify mobile experience
- [ ] Proofread all content

---

## 📝 NOTES

### Why Single Page?
The redesign consolidates everything into one immersive scroll experience because:
- Better storytelling flow
- Improved mobile experience
- Easier maintenance
- Faster load times
- More engaging user journey
- Professional pitch deck format

### Content Preservation
All content from the old pages has been:
- ✅ Integrated into new sections
- ✅ Refined and improved
- ✅ Made more mysterious/intriguing
- ✅ Optimized for the story's tone

Nothing important was lost in the migration.

---

## 🆘 ROLLBACK PLAN

If you need to revert to the old design:

1. The old files are still there (`characters.html`, etc.)
2. You'd need the old `style.css` and `script.js`
3. **Recommendation**: Don't delete old files until you're 100% sure

Or better yet, use Git version control:
```bash
git init
git add .
git commit -m "New single-scroll design"
```

Then you can always revert if needed.

---

## ✅ RECOMMENDED ACTIONS

1. **Test new site** thoroughly
2. **Create backup** of entire project
3. **Archive old HTML files** to `_archive/` folder
4. **Keep images** for potential future use
5. **Add new videos** when ready
6. **Update contact info**
7. **Deploy to production**

---

*This migration represents a significant upgrade in user experience, visual design, and storytelling effectiveness.*


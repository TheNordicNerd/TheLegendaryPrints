# Accessibility Audit for The Legendary Prints

## Tools Available

### 1. @nuxt/a11y (Already Installed)
The Nuxt a11y module provides real-time a11y checking during development.

**How to use:**
- It's already enabled in your nuxt.config.ts
- During development, check your browser console for a11y warnings
- It uses axe-core under the hood

### 2. Lighthouse (Built into Chrome/Edge)
**How to run:**
1. Open your site in Chrome
2. Press F12 to open DevTools
3. Go to "Lighthouse" tab
4. Select "Accessibility" category
5. Click "Generate report"

### 3. axe DevTools Browser Extension
**Install:**
- Chrome: https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/

**How to use:**
1. Install extension
2. Open DevTools
3. Go to "axe DevTools" tab
4. Click "Scan ALL of my page"

### 4. pa11y CLI (Recommended for CI/CD)
**Install and run:**
```bash
npm install -g pa11y
pa11y http://localhost:3000
```

## Quick Manual Audit Checklist

### ✅ Keyboard Navigation
- [ ] All interactive elements can be reached with Tab
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] No keyboard traps

### ✅ Screen Reader Support
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Buttons have descriptive text
- [ ] Links have meaningful text (not "click here")
- [ ] ARIA labels where needed

### ✅ Color & Contrast
- [ ] Text contrast ratio is at least 4.5:1
- [ ] Interactive elements meet contrast requirements
- [ ] Color is not the only way to convey information

### ✅ Semantic HTML
- [ ] Headings are in order (h1 > h2 > h3)
- [ ] Lists use <ul>/<ol>
- [ ] Navigation uses <nav>
- [ ] Main content in <main>

### ✅ Forms
- [ ] All inputs have associated labels
- [ ] Error messages are clear
- [ ] Required fields are marked
- [ ] Form validation is accessible

## Run Quick Check Now

Run this command to get a quick overview:
```bash
# Start your dev server first (npm run dev)
# Then in a new terminal:
npx pa11y --runner axe --reporter cli http://localhost:3000
```


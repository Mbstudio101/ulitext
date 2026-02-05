# ⚙️ Configuration Required Before Use

## Important: Update GitHub Repository URL

Before the extension can use the auto-update system, you need to update the GitHub repository URL in `background.js`.

### Step 1: Create GitHub Repository

1. Go to https://github.com
2. Create a new repository named `ulitext`
3. Note your username

### Step 2: Update background.js

Open `background.js` and find line 8:

```javascript
var UPDATE_URL = 'https://api.github.com/repos/YOUR_USERNAME/ulitext/releases/latest';
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

For example, if your username is `johndoe`:
```javascript
var UPDATE_URL = 'https://api.github.com/repos/johndoe/ulitext/releases/latest';
```

### Step 3: Push Code to GitHub

```bash
cd /Users/marvens/Downloads/Ulitext
git init
git add .
git commit -m "Initial commit - Ulitext v1.0.0"
git remote add origin https://github.com/YOUR_USERNAME/ulitext.git
git push -u origin main
```

### Step 4: Create First Release (Optional)

To enable the update system to work:

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag: `v1.0.0`
4. Title: `Initial Release`
5. Description: Add release notes
6. Publish release

---

## Alternative: Disable Auto-Updates

If you don't want to use the auto-update feature:

In `background.js` line 9, set:
```javascript
var ENABLE_UPDATE_CHECKS = false;
```

This will disable all update checking functionality.

---

## Quick Start (After Configuration)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `/Users/marvens/Downloads/Ulitext` directory
5. Extension is now installed!

See [QUICKSTART.md](QUICKSTART.md) for usage instructions.

---

## Files Ready to Use

✅ All files are complete and ready:
- manifest.json
- popup.html, popup.js
- content.js, content.css
- background.js (just needs GitHub URL updated)
- Icons (all 3 sizes)
- Documentation (6 files)

Total: 15 files, ~60 KB

---

## Need Help?

- Installation: See [INSTALL.md](INSTALL.md)
- Usage: See [USAGE.md](USAGE.md)
- Testing: See [TESTING.md](TESTING.md)
- Problems: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

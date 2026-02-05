# Installation Guide

Complete step-by-step instructions for installing the Ulitext Chrome Extension.

## 📋 Prerequisites

- **Google Chrome** 88 or later
- **Microsoft Edge** 88 or later (Chromium-based)
- **Brave Browser** (any recent version)
- Or any other **Chromium-based browser**

## 🔧 Installation Methods

### Method 1: Developer Mode (Recommended for Testing)

This method allows you to install the extension from the source code.

#### Step 1: Download Extension Files

**Option A: Clone from GitHub**
```bash
git clone https://github.com/YOUR_USERNAME/ulitext.git
cd ulitext
```

**Option B: Download ZIP**
1. Download the repository as a ZIP file
2. Extract to a permanent location (e.g., `~/Extensions/Ulitext`)
3. **Important**: Don't delete this folder after installation!

#### Step 2: Open Chrome Extensions Page

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
   - Or click the puzzle icon → "Manage Extensions"
   - Or go to Menu → More Tools → Extensions

#### Step 3: Enable Developer Mode

1. Look for the **Developer mode** toggle in the top-right corner
2. Click the toggle to **enable** Developer Mode
3. New buttons should appear: "Load unpacked", "Pack extension", "Update"

#### Step 4: Load Extension

1. Click the **"Load unpacked"** button
2. Navigate to the Ulitext directory
3. Select the folder containing `manifest.json`
4. Click **"Select Folder"** or **"Open"**

#### Step 5: Verification

✅ **Success Indicators:**
- Extension appears in the extensions list
- No error messages displayed
- Ulitext icon visible in the toolbar

❌ **If you see errors:**
- Check that you selected the correct folder
- Ensure all files are present (see [File Structure](#file-structure))
- See [Common Installation Errors](#common-installation-errors)

#### Step 6: Pin to Toolbar (Optional but Recommended)

1. Click the puzzle icon (Extensions) in Chrome toolbar
2. Find "Ulitext" in the list
3. Click the pin icon to keep it visible

### Method 2: Chrome Web Store

*Coming soon...*

Once published to the Chrome Web Store:
1. Visit the extension page
2. Click "Add to Chrome"
3. Confirm permissions
4. Done!

## 📁 File Structure

Ensure your installation folder contains these files:

```
Ulitext/
├── manifest.json          ✅ Required
├── popup.html            ✅ Required
├── popup.js              ✅ Required
├── content.js            ✅ Required
├── content.css           ✅ Required
├── background.js         ✅ Required
├── icons/                ✅ Required
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md             ℹ️ Optional
├── INSTALL.md            ℹ️ Optional
└── ...other docs         ℹ️ Optional
```

## ⚠️ Common Installation Errors

### Error: "Manifest file is missing or unreadable"

**Cause**: Wrong folder selected or corrupted files

**Solution**:
- Ensure you selected the folder containing `manifest.json`
- Re-download/extract the files
- Check file permissions

### Error: "Cannot load extension with file or directory name..."

**Cause**: Special characters in folder path

**Solution**:
- Move extension to a path without special characters
- Avoid spaces, accents, or symbols in folder names

### Error: "Failed to load extension from: [path]"

**Cause**: Missing required files

**Solution**:
- Verify all files exist (see [File Structure](#file-structure))
- Re-download the complete package
- Don't modify file names

### Error: "This extension may not be installed from this source"

**Cause**: Trying to install .crx file directly

**Solution**:
- Use Developer Mode + "Load unpacked" (Method 1)
- Or install from Chrome Web Store when available

### Extension Loads but Doesn't Work

**Cause**: Content script injection issues

**Solution**:
1. Reload the extension: Go to `chrome://extensions/` → Click reload icon
2. Refresh any open tabs
3. Try on a simple webpage first (not chrome:// pages)

## 🔄 Updating the Extension

### Manual Update (Developer Mode)

1. Download the new version
2. Replace old files with new files
3. Go to `chrome://extensions/`
4. Click the **reload icon** on Ulitext card
5. Refresh any open tabs

### Automatic Update (Chrome Web Store)

Once installed from the store, Chrome updates extensions automatically.

## 🗑️ Uninstallation

### To Remove Extension

1. Go to `chrome://extensions/`
2. Find Ulitext in the list
3. Click **"Remove"** button
4. Confirm removal

### To Remove Data

Extension data is automatically removed when you uninstall. To manually clear:

1. Before uninstalling, right-click extension icon
2. Select "Inspect popup"
3. Console tab: `chrome.storage.local.clear()`

## ✅ Post-Installation Checklist

After installation, verify:

- [ ] Extension appears in `chrome://extensions/`
- [ ] No error messages displayed
- [ ] Icon visible in toolbar (or extensions menu)
- [ ] Popup opens when clicking icon
- [ ] Popup shows "Capture Screenshot" button
- [ ] Version number displays in footer
- [ ] No console errors (right-click → Inspect popup)

## 🆘 Getting Help

If you encounter issues:

1. **Check** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. **Review** console for errors (F12 → Console)
3. **Reload** extension and refresh tabs
4. **Report** issue on GitHub with:
   - Chrome version
   - Operating system
   - Error messages
   - Steps to reproduce

## 🔐 Permissions Explained

During installation, Chrome may show these permission requests:

- **Read and change data on all websites**: Required to inject screenshot overlay
- **Display notifications**: For OCR completion alerts
- **Storage**: To save last OCR result

These permissions are used solely for extension functionality. See [README.md Privacy section](README.md#privacy--security) for details.

---

**Next Steps:**
- Read [QUICKSTART.md](QUICKSTART.md) for a 2-minute intro
- See [USAGE.md](USAGE.md) for detailed usage instructions
- Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues

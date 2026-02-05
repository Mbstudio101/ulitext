# Troubleshooting Guide

Solutions to common issues you might encounter with Ulitext.

## 🚨 Installation Issues

### Extension Won't Load

**Problem**: Error when loading unpacked extension

**Solutions**:
1. ✅ Verify you selected the correct folder (contains manifest.json)
2. ✅ Check all required files are present (manifest.json, popup.html, popup.js, content.js, content.css, background.js, icons/)
3. ✅ Ensure no syntax errors in JSON files
4. ✅ Try removing and re-loading the extension
5. ✅ Check Chrome console for specific error messages

### "Manifest file is missing or unreadable"

**Cause**: Wrong directory selected or corrupted manifest.json

**Solutions**:
- Navigate to correct folder containing manifest.json
- Re-download extension files
- Check file isn't corrupted (open in text editor)

### Icons Not Displaying

**Cause**: Missing icon files or wrong paths

**Solutions**:
- Verify icons/ folder contains icon16.png, icon48.png, icon128.png
- Check file names match exactly (case-sensitive)
- Reload extension after fixing files

---

## 📸 Capture Issues

### Selection Overlay Doesn't Appear

**Problem**: Clicking "Capture Screenshot" doesn't show overlay

**Solutions**:
1. ✅ **Reload the tab** - Press F5 or Cmd+R
2. ✅ **Check page restrictions** - Can't capture on:
   - chrome:// pages
   - chrome://extensions/
   - Chrome Web Store
   - Browser settings
3. ✅ **Reload extension**:
   - Go to chrome://extensions/
   - Click reload icon on Ulitext
   - Refresh the tab
4. ✅ **Check console for errors**:
   - F12 → Console tab
   - Look for red errors

### Can't Select Area / Mouse Events Don't Work

**Cause**: JavaScript conflicts or overlay issues

**Solutions**:
- Disable other extensions temporarily
- Check for page JavaScript errors (F12 → Console)
- Try on a simpler page (e.g., news article)
- Reload extension and tab

### ESC Key Doesn't Cancel

**Cause**: Keyboard event listener not registered

**Solutions**:
- Move mouse cursor over the page first
- Click once on the page to focus it
- Try reloading the tab

### Selection Box Not Visible

**Cause**: CSS not loading or z-index issues

**Solutions**:
- Check content.css file exists
- Reload extension
- Try on different webpage
- Check browser zoom level (100% is best)

---

## 🔍 OCR Issues

### OCR Takes Forever (> 1 minute)

**First Use**:
- **Normal**: First use downloads ~10MB of language data
- **Wait**: 30-60 seconds is expected
- **One-time**: Subsequent uses will be much faster (2-20 secs)

**Subsequent Uses**:
- Large selection: Select smaller text area
- Low memory: Close other tabs and applications
- Network: First use requires internet connection

### OCR Returns Empty Text

**Causes**:
1. Selected area contains no text
2. Text too small or blurry
3. Very low contrast
4. Selected empty/background area

**Solutions**:
- **Zoom in** before capturing (Ctrl +)
- Select only text areas
- Ensure clear, readable text
- Try higher contrast areas
- Verify selection includes actual text

### OCR Returns Gibberish / Wrong Text

**Common Causes**:
- Handwritten text (not supported well)
- Stylized or decorative fonts
- Rotated or skewed text
- Text over complex backgrounds
- Very small font size
- Poor contrast

**Solutions**:
1. ✅ **Re-capture** with better selection
2. ✅ **Zoom in** on text before capturing
3. ✅ **Select simpler text** areas
4. ✅ **Ensure horizontal text** (not rotated)
5. ✅ **Check page brightness** (increase if too dark)
6. ✅ **Manually edit** result in popup textarea

### OCR Fails with Error

**Problem**: Error notification "OCR processing failed"

**Solutions**:
- Check internet connection (first use only)
- Reload extension
- Clear browser cache
- Check console for specific error:
  ```
  F12 → Console → Look for Tesseract errors
  ```
- Try smaller selection first (test if OCR works at all)

---

## 📋 Clipboard Issues

### Text Not Auto-Copied

**Problem**: Text extracted but not in clipboard

**Solutions**:
1. ✅ **Use manual copy**:
   - Open Ulitext popup
   - Click "Copy to Clipboard" button
2. ✅ **Check permissions**:
   - Browser may block clipboard access
   - Look for permission prompts
3. ✅ **Try different page**:
   - Some pages restrict clipboard access
   - Test on simple page first
4. ✅ **Check for errors**:
   - F12 → Console
   - Look for clipboard-related errors

### Manual Copy Button Doesn't Work

**Cause**: Clipboard API blocked or failed

**Solutions**:
- **Workaround**: Select text manually in popup and Ctrl+C
- Check browser clipboard permissions
- Try in a regular tab (not incognito if clipboard disabled)
- Update browser to latest version

---

## 🔔 Notification Issues

### No Notifications Appearing

**Problem**: OCR completes but no notification

**Solutions**:
1. ✅ **Check notification permissions**:
   - chrome://settings/content/notifications
   - Ensure Chrome notifications enabled
   - Check Ulitext is allowed
2. ✅ **Check OS settings**:
   - macOS: System Preferences → Notifications
   - Windows: Settings → System → Notifications
   - Ensure Chrome notifications on
3. ✅ **Do Not Disturb**:
   - Disable Do Not Disturb / Focus mode
4. ✅ **Test manually**:
   - Open extension
   - Try OCR on simple text

### Notification Shows But No Preview

**Expected**: Preview limited to first 100 characters

**If totally blank**:
- Check if OCR returned empty text
- Verify text was actually extracted
- Open popup to see full result

---

## 🔄 Update Issues

### Update Notifications Won't Go Away

**Solutions**:
- Click "Dismiss" in update banner
- If persists, clear storage:
  ```javascript
  chrome.storage.local.set({ updateAvailable: false })
  ```

### Update Check Fails Silently

**Expected Behavior**: Update checks fail silently (no user notification)

**If concerned**:
- Check console for errors
- Verify UPDATE_URL in background.js is correct
- Ensure internet connection active

### "NEW" Badge Stuck on Icon

**Solutions**:
- Dismiss update banner in popup
- Or manually clear badge:
  1. F12 on background page
  2. Run: `chrome.action.setBadgeText({ text: '' })`

---

## ⚙️ Performance Issues

### Popup Opens Slowly

**Causes**:
- Large stored result
- Too many extensions
- Low system resources

**Solutions**:
- Clear stored results
- Close other extensions
- Restart browser

### Browser Freezes During OCR

**Rare Issue**:
- Very large selections can cause delays
- Select smaller areas
- Close heavy tabs
- Increase system memory

### High Memory Usage

**Normal**:
- Tesseract.js OCR requires ~50-100MB
- First use downloads language data

**If excessive (> 500MB)**:
- Reload extension
- Browser leak possible - restart Chrome

---

## 🐛 Console Debugging

### How to Check Console

**For Popup**:
1. Right-click Ulitext icon
2. Select "Inspect popup"
3. Console tab shows popup errors

**For Background Script**:
1. Go to chrome://extensions/
2. Find Ulitext
3. Click "Inspect views: background page"
4. Console tab shows background errors

**For Content Script**:
1. Open page where you're capturing
2. Press F12
3. Console tab shows content script errors

### Common Error Messages

#### `Cannot read property of undefined`

**Likely Cause**: Storage not initialized or missing data

**Solution**: Clear storage and retry

#### `Failed to execute 'sendMessage'`

**Cause**: Popup closed before message sent

**Solution**: Normal if popup closes quickly - ignore

#### `Uncaught (in promise)`

**Cause**: Promise rejection not handled

**Solution**: Check previous errors for root cause

#### `Tesseract.js worker failed`

**Cause**: Network issue or corrupted download

**Solution**:
- Check internet connection
- Clear browser cache
- Reload extension

---

## 🔄 Reset & Reinstall

### Soft Reset (Keep Settings)

```javascript
// In popup inspect console:
chrome.storage.local.clear()
```

Then reload extension.

### Hard Reset (Clean Install)

1. Go to chrome://extensions/
2. Click "Remove" on Ulitext
3. Reload browser
4. Reinstall extension from source

### Clear All Data

1. Uninstall extension
2. Browser automatically clears extension data
3. To verify: Check chrome://settings/clearBrowserData

---

## 📞 Getting Help

If none of these solutions work:

### Before Reporting Issue

Gather this information:
- Chrome version: chrome://version/
- Operating system & version
- Extension version (see popup footer)
- Exact error message (screenshot)
- Console errors (F12 → Console → screenshot)
- Steps to reproduce

### Report Issue

1. **GitHub Issues**: [Create issue](https://github.com/YOUR_USERNAME/ulitext/issues)
2. **Include**:
   - System information
   - Error messages/screenshots
   - Steps to reproduce
   - Expected vs actual behavior

### Community Support

- Check existing GitHub issues
- Search [README.md](README.md) for answers
- Review [USAGE.md](USAGE.md) for tips

---

## 💡 Prevention Tips

**To avoid most issues**:

1. ✅ **Keep Chrome updated** (chrome:// chrome://settings/help)
2. ✅ **Don't modify extension files** after installation
3. ✅ **Pin to toolbar** for easy access
4. ✅ **Test on simple pages** first (news articles)
5. ✅ **Reload tab** if behavior is weird
6. ✅ **Reload extension** periodically (chrome://extensions/)
7. ✅ **Select clear text** for best results
8. ✅ **Check console** when debugging

---

**Still having issues?**

- [README.md](README.md) - Full documentation
- [USAGE.md](USAGE.md) - Detailed usage guide
- [QUICKSTART.md](QUICKSTART.md) - Quick reference
- [TESTING.md](TESTING.md) - Test your installation

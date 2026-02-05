# Testing Guide

Comprehensive checklist to verify Ulitext is working correctly.

## 📋 Testing Checklist

Use this checklist to systematically test all functionality.

---

## ✅ Installation Tests

### Test 1: Extension Loads

- [ ] Go to `chrome://extensions/`
- [ ] Extension appears in list
- [ ] No error messages shown
- [ ] Icon displays correctly
- [ ] Version shows as "1.0.0"

**Expected**: Extension loads without errors

**If Failed**: See [INSTALL.md](INSTALL.md)

---

### Test 2: Files Present

Verify all required files exist:

- [ ] manifest.json
- [ ] popup.html
- [ ] popup.js
- [ ] content.js
- [ ] content.css
- [ ] background.js
- [ ] icons/icon16.png
- [ ] icons/icon48.png
- [ ] icons/icon128.png

**Expected**: All files present

---

### Test 3: Popup Opens

- [ ] Click Ulitext icon in toolbar
- [ ] Popup window appears
- [ ] Shows "Ulitext" header with gradient
- [ ] "Capture Screenshot" button visible
- [ ] Textarea visible
- [ ] "Copy to Clipboard" button visible
- [ ] Version number in footer

**Expected**: Popup opens with all UI elements

**If Failed**: Right-click icon → Inspect popup → Check console for errors

---

## 📸 Screenshot Capture Tests

### Test 4: Overlay Appears

Test on simple webpage (e.g., https://example.com):

- [ ] Open test page
- [ ] Click Ulitext icon
- [ ] Click "Capture Screenshot"
- [ ] Popup closes
- [ ] Screen dims with dark overlay
- [ ] Instructions appear at top
- [ ] Cursor changes to crosshair

**Expected**: Overlay appears within 100ms

**If Failed**: Reload page and try again

---

### Test 5: Selection Works

- [ ] Click and hold mouse button
- [ ] Drag to create rectangle
- [ ] Blue selection box appears
- [ ] Box follows mouse movement
- [ ] Release mouse button

**Expected**: Blue selection box tracks mouse movement

---

### Test 6: ESC Cancels Selection

- [ ] Start capture
- [ ] Overlay appears
- [ ] Press ESC key
- [ ] Overlay disappears
- [ ] Page returns to normal

**Expected**: ESC immediately removes overlay

---

### Test 7: Minimum Size Validation

- [ ] Start capture
- [ ] Make very small selection (< 10x10 pixels)
- [ ] Release mouse
- [ ] Overlay should disappear without processing

**Expected**: Tiny selections ignored gracefully

---

### Test 8: Multiple Captures

- [ ] Perform first capture
- [ ] Immediately perform second capture
- [ ] Both should work without errors

**Expected**: Can perform multiple captures in succession

---

## 🔍 OCR Processing Tests

### Test 9: Basic Text Extraction

Test on page with clear text (news article):

- [ ] Capture area with 1-2 lines of text
- [ ] Wait for processing (2-10 seconds)
- [ ] Check extracted text in popup
- [ ] Text should match original (mostly)

**Expected**: Text extracted with reasonable accuracy

**Note**: First use may take 30-60 seconds (downloading OCR data)

---

### Test 10: Paragraph Extraction

- [ ] Select larger text area (paragraph)
- [ ] Wait for OCR processing
- [ ] Verify extracted text

**Expected**: Paragraph text extracted, may take 5-10 seconds

---

### Test 11: Empty Area

- [ ] Select area with no text (background only)
- [ ] OCR should complete
- [ ] Result may be empty or gibberish

**Expected**: No crash, completes gracefully

---

### Test 12: High-DPI Display

If you have Retina/4K display:

- [ ] Perform capture on high-DPI display
- [ ] Verify text extracted correctly
- [ ] No scaling issues

**Expected**: DPI scaling handled automatically

---

## 📋 Clipboard Tests

### Test 13: Auto-Copy

- [ ] Perform OCR capture
- [ ] Wait for completion
- [ ] Open text editor
- [ ] Paste (Ctrl+V / Cmd+V)
- [ ] Verify text is pasted

**Expected**: Text automatically in clipboard

---

### Test 14: Manual Copy Button

- [ ] Open Ulitext popup
- [ ] Click "Copy to Clipboard" button
- [ ] Button turns green with "✓ Copied!"
- [ ] Paste into text editor
- [ ] Verify text pasted

**Expected**: Manual copy works, visual feedback shown

---

### Test 15: Edit and Copy

- [ ] Extract some text via OCR
- [ ] Open popup
- [ ] Edit text in textarea
- [ ] Click "Copy to Clipboard"
- [ ] Paste edited version

**Expected**: Edited text is copied

---

## 🔔 Notification Tests

### Test 16: Success Notification

- [ ] Complete successful OCR
- [ ] Chrome notification appears
- [ ] Title: "OCR Complete! ✓"
- [ ] Shows text preview (first 100 chars)

**Expected**: Notification appears on success

**If Failed**: Check chrome://settings/content/notifications

---

### Test 17: Click Notification

- [ ] Wait for OCR notification
- [ ] Click notification
- [ ] Popup should open

**Expected**: Clicking notification opens popup

---

### Test 18: Error Notification

To test error (optional):

- [ ] Force an error (disconnect internet on first use)
- [ ] Error notification should appear

**Expected**: Errors shown via notification

---

## 💾 Storage Tests

### Test 19: Result Persistence

- [ ] Perform OCR capture
- [ ] Note extracted text
- [ ] Close popup
- [ ] Close browser completely
- [ ] Reopen browser
- [ ] Open Ulitext popup
- [ ] Verify same text still in textarea

**Expected**: Last result persists across sessions

---

### Test 20: Clear and New Capture

- [ ] Have text in popup from previous capture
- [ ] Perform new capture
- [ ] New text should replace old text

**Expected**: New result replaces old result

---

## 🔄 Auto-Update Tests

### Test 21: Update Check on Install

Check console logs:

- [ ] Install extension
- [ ] Open background service worker console
  - chrome://extensions/ → Ulitext → "Inspect views"
- [ ] Look for "Running update check" or similar log
- [ ] Verify no errors

**Expected**: Update check runs on install

---

### Test 22: Update Check Alarm

- [ ] Check alarms set correctly
- [ ] In background console: `chrome.alarms.getAll(console.log)`
- [ ] Should show "updateCheck" alarm

**Expected**: Alarm registered for periodic checks

---

### Test 23: Mock Update Available

Manually trigger update banner:

1. Open popup
2. Right-click → Inspect popup
3. In console:
```javascript
chrome.storage.local.set({
  updateAvailable: true,
  latestVersion: '1.0.1',
  releaseNotes: 'Test update',
  downloadUrl: 'https://github.com'
})
```
4. Close and reopen popup
5. Update banner should appear
6. Badge should show on icon

- [ ] Update banner displays at top
- [ ] Shows version number
- [ ] "View Release" button works
- [ ] "Dismiss" button hides banner
- [ ] Badge appears on icon

**Expected**: Update UI components work correctly

---

### Test 24: Dismiss Update

- [ ] Trigger mock update (Test 23)
- [ ] Click "Dismiss" button
- [ ] Close and reopen popup
- [ ] Banner should not appear

**Expected**: Dismissed updates stay dismissed

---

## 🌐 Browser Compatibility Tests

### Test 25: Different Page Types

Test on various page types:

- [ ] News article (e.g., CNN, BBC)
- [ ] Wikipedia page
- [ ] GitHub page
- [ ] Gmail (if not restricted)
- [ ] PDF in browser
- [ ] Image with text

**Expected**: Works on most standard pages

**Known to Fail**: chrome://* pages (expected)

---

### Test 26: Restricted Pages

Test that graceful failure occurs:

- [ ] Try on chrome://extensions/
- [ ] Should show error or not inject

**Expected**: Error message or graceful failure

---

## 🎨 UI/UX Tests

### Test 27: Visual Design

- [ ] Popup has purple/blue gradient header
- [ ] Capture button is prominent
- [ ] Textarea is readable
- [ ] Copy button has hover effect
- [ ] Update banner (if visible) is green
- [ ] Status messages display correctly
- [ ] Loading spinner appears during OCR

**Expected**: All UI elements styled correctly

---

### Test 28: Responsive Behavior

- [ ] Popup is 320px wide
- [ ] All elements fit without scrolling horizontally
- [ ] Textarea is resizable vertically
- [ ] Buttons are clickable and sized appropriately

**Expected**: UI is responsive and well-sized

---

### Test 29: Status Messages

- [ ] Start capture
- [ ] Watch popup for status updates
- [ ] Should show: "Capturing screenshot..."
- [ ] Then: "Processing image..."
- [ ] Then: "Extracting text..."
- [ ] Finally: "OCR Complete! ✓"

**Expected**: Status messages update during processing

---

## ⚡ Performance Tests

### Test 30: Processing Speed

Measure OCR times:

- [ ] Small text (1-2 lines): < 5 seconds
- [ ] Medium text (paragraph): < 10 seconds
- [ ] Large text (full page): < 20 seconds

**Expected**: Meets performance targets

**Note**: First use will be slower (30-60 seconds)

---

### Test 31: Memory Usage

- [ ] Open Chrome Task Manager (Shift+Esc)
- [ ] Find Ulitext extension
- [ ] Perform several OCR captures
- [ ] Monitor memory usage
- [ ] Should stay under 200MB

**Expected**: Reasonable memory usage

---

### Test 32: No Memory Leaks

- [ ] Perform 10+ captures in succession
- [ ] Monitor memory in Task Manager
- [ ] Memory should not continuously increase

**Expected**: Memory stabilizes, no major leaks

---

## 🐛 Error Handling Tests

### Test 33: Network Error (First Use)

- [ ] Uninstall and reinstall extension
- [ ] Disconnect internet
- [ ] Perform first capture
- [ ] Should show error message

**Expected**: Graceful error handling

---

### Test 34: Page Reload During Capture

- [ ] Start selection overlay
- [ ] Reload page (F5) before completing selection
- [ ] No errors should occur

**Expected**: Graceful handling of page reload

---

### Test 35: Rapid Clicks

- [ ] Click "Capture Screenshot" rapidly 5 times
- [ ] Extension should not crash

**Expected**: Handles rapid interactions

---

## 📊 Test Results Summary

After completing all tests, summarize:

```
✅ Passed: __/35
⚠️  Warning: __/35 (works but with issues)
❌ Failed: __/35

Total Pass Rate: ___%
```

### Acceptable Ranges

- **90-100%**: Excellent, ready for release
- **75-89%**: Good, minor issues to fix
- **60-74%**: Fair, significant work needed
- **< 60%**: Poor, major issues present

---

## 🔍 Console Error Check

Before declaring tests complete:

### Check All Consoles

**Popup Console**:
- [ ] Right-click icon → Inspect popup
- [ ] No red errors in console

**Background Console**:
- [ ] chrome://extensions/ → Service worker "Inspect"
- [ ] No critical errors
- [ ] Update check logs present

**Content Console**:
- [ ] F12 on test page after capture
- [ ] No content script errors

**Expected**: No critical console errors

---

## 📝 Bug Reporting Template

If tests fail, use this template:

```
**Test Number**: Test X
**Test Name**: [Name]
**Status**: ❌ Failed

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happened]

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Console Errors**:
```
[Paste any errors]
```

**Screenshots**:
[Attach if relevant]

**Environment**:
- Chrome Version: [chrome://version/]
- OS: [Windows/Mac/Linux + version]
- Extension Version: 1.0.0
```

---

## ✨ Final Validation

Before considering extension complete:

- [ ] All core features work (capture, OCR, clipboard, notifications)
- [ ] No critical errors in console
- [ ] Documentation complete (README, INSTALL, USAGE, QUICKSTART, TROUBLESHOOTING)
- [ ] Auto-update system functional
- [ ] UI is polished and professional
- [ ] Pass rate > 85%

**When all checks pass**: Extension is ready! 🎉

---

**Related Documentation**:
- [README.md](README.md) - Overview and features
- [INSTALL.md](INSTALL.md) - Installation instructions
- [USAGE.md](USAGE.md) - How to use
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues

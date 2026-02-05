# Usage Guide

Learn how to use Ulitext effectively to capture and extract text from screenshots.

## 🎯 Basic Workflow

1. **Open Extension** → Click Ulitext icon in toolbar
2. **Start Capture** → Click "Capture Screenshot" button
3. **Select Area** → Click and drag to select text area
4. **Wait for OCR** → Processing takes 2-10 seconds
5. **Use Text** → Text is auto-copied and displayed in popup

## 📸 Capturing Screenshots

### Starting a Capture

**Method 1: From Popup**
1. Click the Ulitext icon in your browser toolbar
2. Click the **"Capture Screenshot"** button
3. Popup closes automatically
4. Selection overlay appears on current tab

**Method 2: Keyboard Shortcut** *(Coming soon)*

### Making a Selection

1. **Click** where you want to start the selection
2. **Drag** to create a rectangle around the text
3. **Release** to capture the selected area

**Visual Feedback:**
- Screen dims with semi-transparent overlay
- Blue selection box shows your selection
- Instructions displayed at top

### Canceling a Selection

Press **ESC** key at any time to cancel and remove the overlay.

### Selection Tips

✅ **Good Selection:**
- Rectangle tightly around text
- 10x10 pixels minimum size
- Clear, readable text inside
- High contrast with background

❌ **Avoid:**
- Tiny selections (< 10x10 pixels) - will be ignored
- Empty areas or pure backgrounds
- Very large selections (> 2000x2000 pixels) - may be slow
- Multiple text blocks with different orientations

## 🔍 Understanding OCR Results

### Processing Time

| Text Amount | Expected Time |
|------------|---------------|
| 1-2 lines  | 2-5 seconds   |
| Paragraph  | 5-10 seconds  |
| Full page  | 10-20 seconds |

First use may take longer (30-60 sec) while Tesseract.js downloads OCR data (~10MB).

### Notification

When OCR completes:
1. Chrome notification appears with "OCR Complete! ✓"
2. Shows preview of first 100 characters
3. Click notification to open popup
4. Text automatically copied to clipboard

### Viewing Results

**In Popup:**
- Open Ulitext popup to see full extracted text
- Text displayed in textarea
- Last result saved automatically
- Persists across browser sessions

**Edit Text:**
- Click in textarea to edit extracted text
- Correct any OCR errors manually
- Changes saved when you copy again

## 📋 Using Extracted Text

### Auto-Copy to Clipboard

**Automatic:**
- Text copied immediately after successful OCR
- No manual action needed
- Paste anywhere with Ctrl+V / Cmd+V

**Manual Copy:**
1. Open Ulitext popup
2. Click **"Copy to Clipboard"** button
3. Button turns green with "✓ Copied!" confirmation
4. Paste text anywhere

### Editing Before Copy

1. Open popup to view extracted text
2. Edit text in textarea as needed
3. Click "Copy to Clipboard" to copy edited version

## 💡 Best Practices for Accuracy

### Text Characteristics

**✅ Works Best With:**
- **Clear, printed text** (like books, documents, screenshots)
- **High contrast** (dark text on light background or vice versa)
- **Horizontal text** (left-to-right orientation)
- **Standard fonts** (Arial, Times New Roman, etc.)
- **Medium to large font sizes** (12pt+)
- **Single language** (English)

**⚠️ May Struggle With:**
- Handwritten text
- Stylized or decorative fonts
- Rotated or skewed text
- Very small text (< 10pt)
- Low contrast or faded text
- Text over complex backgrounds
- Multiple colors or patterns behind text

### Environmental Factors

**Optimal Conditions:**
- Good screen brightness
- Clean display (no smudges or reflections)
- Proper screen resolution
- Stable page (not scrolling or animating)

### Page Types

**✅ Great for:**
- PDF documents in browser
- Article text
- Email messages
- Social media posts
- Code snippets
- Image-based text

**❌ Not Supported:**
- Chrome internal pages (chrome://*)
- Browser settings pages
- Extension management pages
- Restricted domains

## 🎨 Common Use Cases

### 1. Extracting Text from Images

**Scenario:** You have an image with text but can't copy it

**Steps:**
1. Open image in browser (or in a webpage)
2. Click Ulitext icon
3. Click "Capture Screenshot"
4. Select text area in image
5. Paste extracted text anywhere

### 2. Copying Text from PDFs

**Scenario:** PDF has copy protection or styling issues

**Steps:**
1. Open PDF in Chrome
2. Zoom to comfortable reading size
3. Capture text with Ulitext
4. OCR extracts clean, plain text

### 3. Transcribing Screenshots

**Scenario:** Someone sent you a screenshot of text

**Steps:**
1. Open screenshot in browser
2. Capture with Ulitext
3. Get editable, searchable text

### 4. Code from Screenshots

**Scenario:** Code snippet shared as image

**Steps:**
1. Open image
2. Capture code area
3. Edit any formatting issues
4. Copy to your IDE

### 5. Quotes and Citations

**Scenario:** Need to quote text from image/video

**Steps:**
1. Pause video or view image
2. Capture quote with Ulitext
3. Get accurate text for citation

## 🔄 Update Notifications

### When Updates Are Available

**You'll see:**
- 📦 Chrome notification: "Update Available"
- 🔴 Red "NEW" badge on extension icon
- 🎉 Green banner at top of popup

**Actions:**
1. **View Release** - See what's new
2. **Dismiss** - Hide banner (check again later)

### Updating the Extension

**Automatic (Chrome Web Store):**
- Chrome updates automatically in background
- Just restart browser when prompted

**Manual (Developer Mode):**
1. Download new version
2. Replace old files
3. Go to chrome://extensions/
4. Click reload button on Ulitext

## ⚙️ Storage and Data

### What's Stored

- **Last OCR Result**: Most recent extracted text
- **Update Check Timestamp**: Last time updates were checked
- **Update Info**: If update available, version and release notes

### Storage Limits

- Chrome allocates ~5MB per extension
- Ulitext uses minimal storage (< 1KB typically)
- Only latest result stored (previous results deleted)

### Clearing Data

**Manual Clear:**
1. Right-click extension icon → "Inspect popup"
2. Console tab: Type `chrome.storage.local.clear()`
3. Press Enter

**Automatic Clear:**
- Data cleared when extension uninstalled

## 🐛 Troubleshooting

### OCR Returns Wrong Text

**Solutions:**
- Re-capture with better selection
- Ensure high contrast
- Try zooming in on text first
- Check text isn't rotated

### Nothing Happens When I Capture

**Solutions:**
- Reload the current tab
- Check you're not on chrome:// page
- Reload extension at chrome://extensions/

### Clipboard Doesn't Auto-Copy

**Solutions:**
- Click "Copy to Clipboard" button manually
- Check browser clipboard permissions
- Try on different tab

### Slow OCR Processing

**Normal:**
- First use: 30-60 seconds (one-time)
- Large selections: 10-20 seconds

**If too slow:**
- Select smaller text areas
- Check internet connection (first use only)
- Close other heavy tabs

For more help, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 🔐 Privacy

- All OCR processing is **100% local**
- No text sent to external servers
- No tracking or analytics
- Only update checks contact external servers (GitHub API)

## 📊 Performance

### Expected Performance

- **Overlay appears**: < 100ms
- **Screenshot capture**: < 500ms
- **OCR processing**: 2-20 seconds (depends on text amount)
- **Clipboard copy**: < 100ms

### Optimization Tips

1. **Select only needed text** - smaller = faster
2. **First use requires download** - be patient
3. **Keep extension installed** - OCR data cached
4. **Close heavy tabs** - frees memory

---

**Need More Help?**
- [QUICKSTART.md](QUICKSTART.md) - Quick 2-minute guide
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common problems
- [TESTING.md](TESTING.md) - Test checklist
- [README.md](README.md) - Full documentation

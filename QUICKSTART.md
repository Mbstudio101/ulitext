# Quick Start Guide

Get started with Ulitext in under 2 minutes!

## ⚡ 1-Minute Installation

1. **Download** the extension files
2. Open `chrome://extensions/`
3. Enable **Developer Mode** (top-right toggle)
4. Click **"Load unpacked"**
5. Select the Ulitext folder
6. **Done!** 🎉

## 🎯 First Capture (30 seconds)

1. **Click** the Ulitext icon in your toolbar
2. **Click** "Capture Screenshot" button
3. **Drag** to select text on the page
4. **Wait** ~5 seconds for OCR to process
5. **Paste** text anywhere (it's auto-copied!)

## 📁 File Structure

```
Ulitext/
├── manifest.json       # Extension config
├── popup.html         # UI popup
├── popup.js           # UI logic
├── content.js         # Screenshot overlay
├── content.css        # Overlay styles
├── background.js      # OCR + auto-update
└── icons/             # Extension icons
```

## 🔑 Essential Tips

### For Best OCR Results

- ✅ Select clear, high-contrast text
- ✅ Use horizontal, printed text
- ✅ Ensure good screen brightness
- ❌ Avoid handwritten text
- ❌ Avoid rotated text
- ❌ Don't select tiny text (< 10pt)

### Keyboard Shortcuts

- **ESC** - Cancel selection overlay

### Where It Works

- ✅ Regular webpages
- ✅ PDFs in browser
- ✅ Images with text
- ❌ Chrome internal pages (chrome://*)

## 🔄 Daily Usage

```
1. Click icon
2. Click "Capture Screenshot"
3. Drag to select
4. Paste text (auto-copied)
```

That's it! Repeat as needed.

## ⏱️ Processing Times

| Text Amount | Time       |
|-------------|------------|
| A few words | 2-3 secs   |
| Paragraph   | 5-8 secs   |
| Full page   | 10-20 secs |
| First use*  | 30-60 secs |

*First use downloads OCR language data (~10MB)

## 🆕 Auto-Updates

Ulitext checks for updates automatically every 24 hours.

When an update is available:
- 📦 Notification appears
- 🎉 Banner in popup
- 🔴 Badge on icon

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Extension won't load | Check all files are present |
| Capture doesn't work | Reload the tab |
| OCR is slow | Normal for first use |
| Wrong text extracted | Re-capture with better lighting |

## 📚 Learn More

- **Full Documentation**: See [README.md](README.md)
- **Installation Help**: See [INSTALL.md](INSTALL.md)
- **Detailed Usage**: See [USAGE.md](USAGE.md)
- **Troubleshooting**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Testing Guide**: See [TESTING.md](TESTING.md)

## 🎓 Example Workflow

**Scenario**: Extract text from a screenshot

```
1. Open screenshot in Chrome
2. Click Ulitext icon          (1 second)
3. Click "Capture Screenshot"  (1 second)
4. Drag to select text area    (2 seconds)
5. Wait for OCR                (5 seconds)
6. Paste into document         (1 second)
                               
Total: ~10 seconds
```

## 🚀 Pro Tips

1. **Pin to toolbar**: Click puzzle icon → Pin Ulitext
2. **Zoom first**: Zoom page to make text larger before capture
3. **Edit results**: Click text in popup to edit before copying
4. **Select tighter**: Tight selections = better accuracy

---

**That's all you need to know to get started!**

For advanced features and detailed instructions, check out the other documentation files.

Happy text extracting! 📸✨

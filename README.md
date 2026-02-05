# Ulitext - Screenshot OCR Chrome Extension

![Ulitext Icon](icons/icon128.png)

**Capture screenshots and instantly convert them to text with OCR**

## 🚀 Features

- **📸 Drag-to-Select Capture**: Intuitive click-and-drag interface to select any area of your screen
- **🔍 Instant OCR**: Powered by Tesseract.js for accurate text extraction
- **📋 Auto-Copy**: Extracted text automatically copied to your clipboard
- **🔔 Smart Notifications**: Get notified when OCR completes with text preview
- **💾 Persistent Storage**: Last result saved across browser sessions
- **🆕 Auto-Update System**: Automatically checks for new versions every 24 hours
- **🎨 Beautiful UI**: Modern, polished interface with gradient design
- **⚡ High-DPI Support**: Handles retina and 4K displays perfectly

## 📦 Installation

### From Source (Developer Mode)

1. **Download or Clone** this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer Mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `Ulitext` directory
6. The extension is now installed! 🎉

### From Chrome Web Store

*Coming soon...*

## 🎯 Usage

1. Click the Ulitext icon in your extensions toolbar
2. Click **"Capture Screenshot"** button
3. Click and drag to select the area containing text
4. Press **ESC** to cancel at any time
5. Wait for OCR processing (2-10 seconds)
6. Text is automatically copied to clipboard
7. View and edit extracted text in the popup

## 💡 Best Practices for OCR Accuracy

- Select areas with **clear, high-contrast text**
- Avoid selecting areas with **complex backgrounds**
- Use larger font sizes when possible
- Ensure text is **horizontal** (not rotated)
- Select **one language** at a time (English)
- Give good lighting conditions on the screen

## 🔧 Technical Details

### Technology Stack

- **Manifest Version**: V3 (latest Chrome extension standard)
- **OCR Engine**: Tesseract.js v5 (via CDN)
- **Languages**: JavaScript (ES5 compatible)
- **Storage**: Chrome Storage API
- **Permissions**: activeTab, scripting, storage, notifications, alarms

### File Structure

```
Ulitext/
├── manifest.json         # Extension configuration
├── popup.html           # Extension popup UI
├── popup.js             # Popup logic
├── content.js           # Screenshot selection overlay
├── content.css          # Overlay styles
├── background.js        # OCR processing & auto-update
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── docs/                # Documentation
```

### Performance

- **Selection Overlay**: < 100ms to appear
- **Small Text OCR**: 2-5 seconds
- **Medium Text OCR**: 5-10 seconds
- **Large Text OCR**: 10-20 seconds
- **First Use Setup**: 30-60 seconds (downloads OCR data)

## 🔄 Auto-Update System

Ulitext automatically checks for updates:

- **On Extension Install**: Initial check
- **Every 24 Hours**: Background checks
- **Visual Indicators**: Badge on icon, banner in popup
- **Smart Notifications**: Non-intrusive update alerts

When an update is available:
- 📦 Chrome notification appears
- 🔴 Badge appears on extension icon
- 🎉 Banner displayed in popup with release notes

## 🔒 Privacy & Security

- ✅ **All OCR processing happens locally** (client-side)
- ✅ **No data sent to external servers** (except update checks)
- ✅ **No tracking or analytics**
- ✅ **No user data collection**
- ✅ **Screenshots processed in memory only**
- ✅ **Only last result stored locally**

## 🐛 Troubleshooting

### Extension doesn't capture

- Try reloading the current tab
- Ensure you're not on a restricted page (chrome://)
- Check that the extension has permissions

### OCR accuracy is poor

- Select clearer text areas
- Increase text size if possible
- Ensure good contrast between text and background

### Clipboard doesn't copy

- Check browser clipboard permissions
- Try clicking "Copy to Clipboard" button manually

For more help, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 📝 Version History

### v1.0.0 (Current)
- Initial release
- Screenshot capture with drag-to-select
- OCR with Tesseract.js
- Auto-copy to clipboard
- Chrome notifications
- Auto-update system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

MIT License - feel free to use this project however you'd like!

## 🙏 Acknowledgments

- [Tesseract.js](https://tesseract.projectnaptha.com/) for OCR functionality
- Chrome Extensions team for excellent documentation

---

**Made with ❤️ by the Ulitext Team**

For detailed installation instructions, see [INSTALL.md](INSTALL.md)  
For usage examples, see [USAGE.md](USAGE.md)  
For quick start, see [QUICKSTART.md](QUICKSTART.md)

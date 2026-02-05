# Ulitext Communication Pipeline

## Complete Message Flow

### 1️⃣ Capture Initiation
```
User clicks "Capture Screenshot" in popup
    ↓
popup.js: Sends message to content script
    ↓
content.js: Receives 'startCapture' message
    ↓
content.js: Creates overlay and shows selection UI
```

### 2️⃣ Screenshot Selection
```
User drags to select area
    ↓
content.js: Captures mouse coordinates
    ↓
content.js: Calculates selection with DPI scaling
    ↓
content.js: Cleans up overlay
    ↓
content.js: Sends 'captureScreenshot' message to background
    ↓
background.js: Acknowledges receipt immediately ✓
```

### 3️⃣ OCR Processing Pipeline
```
background.js: "Capturing screenshot..."
    ↓ (notifies popup)
popup.js: Shows status message
    ↓
background.js: chrome.tabs.captureVisibleTab()
    ↓
background.js: "Processing image..."
    ↓ (notifies popup)
popup.js: Updates status message
    ↓
background.js: Crop image to selection
    ↓
background.js: "Extracting text..."
    ↓ (notifies popup)
popup.js: Updates status message
    ↓
background.js: Tesseract.js OCR processing
    ↓
background.js: Saves result to storage
    ↓
background.js: Copies text to clipboard
```

### 4️⃣ Completion
```
background.js: "OCR Complete! ✓"
    ↓ (notifies popup)
popup.js: Shows success message
    ↓
popup.js: Displays extracted text in textarea
    ↓
background.js: Shows Chrome notification
    ↓
User sees results + text is already copied!
```

## Error Handling Flow

### Content Script Error
```
content.js: Sends message fails
    ↓
content.js: Catches chrome.runtime.lastError
    ↓
content.js: Shows alert to user
```

### Background Processing Error
```
background.js: OCR fails
    ↓
background.js: Catches error
    ↓
background.js: Sends 'ocrError' to popup
    ↓
popup.js: Shows error status message
    ↓
background.js: Shows error notification
```

## Key Improvements

✅ **Acknowledgment System**: Background immediately responds to content script  
✅ **Message Channel**: `return true` keeps async channel open  
✅ **Error Propagation**: Errors flow back to user through proper channels  
✅ **Progress Updates**: Real-time status visible in popup  
✅ **Popup Persistence**: Popup stays open to show entire process  

## Message Types

| From → To | Action | Purpose |
|-----------|--------|---------|
| popup → content | `startCapture` | Initiate capture mode |
| content → background | `captureScreenshot` | Send screenshot coordinates |
| background → popup | `ocrProgress` | Update processing status |
| background → popup | `ocrComplete` | Send final OCR text |
| background → popup | `ocrError` | Notify of errors |

## Async Handling

All message listeners use `return true` to keep the channel open for async responses:

```javascript
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Process request
    sendResponse({ success: true });
    return true; // ← Critical for async!
});
```

This ensures messages sent after async operations complete successfully.

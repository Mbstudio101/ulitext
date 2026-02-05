// Offscreen Script - Handles Tesseract OCR

var ocrWorker = null;

// Initialize Tesseract worker with local paths
async function initTesseract() {
    if (ocrWorker) return ocrWorker;

    try {
        console.log('Offscreen: Initializing Tesseract worker...');
        // Configure Tesseract to use local files
        ocrWorker = await Tesseract.createWorker('eng', 1, {
            workerPath: chrome.runtime.getURL('tesseract-data/tesseract-worker.min.js'),
            langPath: chrome.runtime.getURL('tesseract-data'),
            corePath: chrome.runtime.getURL('tesseract-data/tesseract-core.wasm.js')
        });
        console.log('Offscreen: Tesseract worker initialized with local files');
        return ocrWorker;
    } catch (error) {
        console.error('Offscreen: Failed to initialize Tesseract:', error);
        throw error;
    }
}

// Handle messages from background service worker
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'performOCR') {
        processOCR(request.data).then(function (text) {
            sendResponse({ success: true, text: text });
        }).catch(function (error) {
            sendResponse({ success: false, error: error.message });
        });
        return true; // Keep message channel open for async response
    }
});

async function processOCR(imageBlobUrl) {
    try {
        console.log('Offscreen: Fetching image from blob URL...');
        var response = await fetch(imageBlobUrl);
        var blob = await response.blob();

        var worker = await initTesseract();
        console.log('Offscreen: Starting Tesseract recognition...');
        var result = await worker.recognize(blob);

        var text = (result && result.data && result.data.text) ? result.data.text.trim() : '';
        console.log('Offscreen: OCR processed successfully, length:', text.length);

        // Revoke the blob URL to free memory
        URL.revokeObjectURL(imageBlobUrl);

        return text;
    } catch (error) {
        console.error('Offscreen: performOCR error:', error);
        throw new Error('OCR recognition failed - ' + error.message);
    }
}

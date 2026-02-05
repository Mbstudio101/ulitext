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
        console.log('Offscreen: Received OCR request');
        handleProcessing(request.data).then(function (text) {
            sendResponse({ success: true, text: text });
        }).catch(function (error) {
            console.error('Offscreen error:', error);
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }
});

async function handleProcessing(data) {
    var dataUrl = data.dataUrl;
    var captureData = data.captureData;

    try {
        // Step 1: Crop the image using native Canvas/Image
        console.log('Offscreen: Cropping image...');
        var croppedBlob = await cropImage(dataUrl, captureData);

        // Step 2: Initialize Tesseract
        var worker = await initTesseract();

        // Step 3: Perform OCR
        console.log('Offscreen: Starting Tesseract recognition...');
        var result = await worker.recognize(croppedBlob);

        var text = (result && result.data && result.data.text) ? result.data.text.trim() : '';
        console.log('Offscreen: OCR processed successfully, length:', text.length);

        return text;
    } catch (error) {
        console.error('Offscreen processing error:', error);
        throw error;
    }
}

async function cropImage(dataUrl, captureData) {
    return new Promise(function (resolve, reject) {
        console.log('Offscreen: Loading image for cropping...');
        var img = new Image();
        img.onload = function () {
            try {
                console.log('Offscreen: Image loaded, dimensions:', img.width, 'x', img.height);
                var canvas = document.createElement('canvas');
                canvas.width = captureData.width;
                canvas.height = captureData.height;
                var ctx = canvas.getContext('2d');

                // Draw at 1:1 scale
                ctx.drawImage(
                    img,
                    captureData.x, captureData.y,
                    captureData.width, captureData.height,
                    0, 0,
                    captureData.width, captureData.height
                );

                canvas.toBlob(function (blob) {
                    if (!blob) {
                        reject(new Error('Failed to create blob from canvas'));
                        return;
                    }
                    console.log('Offscreen: Crop complete, blob size:', blob.size);
                    resolve(blob);
                }, 'image/png');
            } catch (e) {
                console.error('Offscreen: Crop drawing error:', e);
                reject(e);
            }
        };
        img.onerror = function (err) {
            console.error('Offscreen: Image load error:', err);
            reject(new Error('Failed to load screenshot data (length: ' + dataUrl.length + ')'));
        };
        img.src = dataUrl;
    });
}

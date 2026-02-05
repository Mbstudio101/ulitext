// Offscreen Script - Handles Tesseract OCR

var ocrWorker = null;

// Initialize Tesseract worker with local paths
async function initTesseract() {
    if (ocrWorker) return ocrWorker;

    try {
        console.log('Offscreen: Initializing Tesseract worker from root...');

        // Configure Tesseract to use local files from the root
        ocrWorker = await Tesseract.createWorker('eng', 1, {
            workerPath: chrome.runtime.getURL('/tesseract-worker.min.js'),
            langPath: chrome.runtime.getURL('/'),
            corePath: chrome.runtime.getURL('/tesseract-core.wasm.js'),
            logger: m => console.log('Offscreen OCR Status:', m)
        });
        console.log('Offscreen: Tesseract worker initialized (Ready)');
        return ocrWorker;
    } catch (error) {
        console.error('Offscreen: Failed to initialize Tesseract:', error);
        throw error;
    }
}

// Handle messages from background service worker
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Only respond if targeted to offscreen
    if (request.action === 'performOCR' && request.target === 'offscreen') {
        console.log('Offscreen: Received OCR request');
        handleProcessing(request.data).then(function (text) {
            sendResponse({ success: true, text: text });
        }).catch(function (error) {
            console.error('Offscreen Error Cache:', error);
            // Serialize error to ensure it survives IPC
            sendResponse({
                success: false,
                error: error.message || error.toString() || 'Unknown Offscreen Error'
            });
        });
        return true;
    }
});

async function handleProcessing(data) {
    var dataUrl = data.dataUrl;
    var captureData = data.captureData;

    try {
        // Step 1: Crop the image using native Canvas/Image
        console.log('Offscreen: Processing image...');
        var processedBlob = await processImage(dataUrl, captureData);

        // Step 2: Initialize Tesseract
        var worker = await initTesseract();

        // Step 3: Perform OCR
        console.log('Offscreen: Starting Tesseract recognition...');
        var result = await worker.recognize(processedBlob);

        console.log('Offscreen: OCR Recognition Result:', result.data.text.length, 'chars');

        return {
            text: result.data.text.trim(),
            confidence: result.data.confidence,
            blocks: result.data.blocks.map(b => ({
                text: b.text,
                confidence: b.confidence,
                bbox: b.bbox
            }))
        };
    } catch (error) {
        console.error('Offscreen processing error:', error);
        throw error;
    }
}

async function processImage(dataUrl, captureData) {
    return new Promise(function (resolve, reject) {
        console.log('Offscreen: Loading image for processing...');
        var img = new Image();
        img.onload = function () {
            try {
                // Determine dimensions
                const width = captureData ? captureData.width : img.width;
                const height = captureData ? captureData.height : img.height;
                const x = captureData ? captureData.x : 0;
                const y = captureData ? captureData.y : 0;

                // Create canvas with 2x DPI scaling for better OCR
                var canvas = document.createElement('canvas');
                canvas.width = width * 2;
                canvas.height = height * 2;
                var ctx = canvas.getContext('2d', { willReadFrequently: true });

                // Draw upscaled
                ctx.drawImage(img, x, y, width, height, 0, 0, width * 2, height * 2);

                // Apply Preprocessing Filters
                preprocessCanvas(canvas);

                canvas.toBlob(function (blob) {
                    if (!blob) {
                        reject(new Error('Failed to create blob from processed canvas'));
                        return;
                    }
                    console.log('Offscreen: Preprocessing complete, blob size:', blob.size);
                    resolve(blob);
                }, 'image/png');
            } catch (e) {
                console.error('Offscreen: Processing error:', e);
                reject(e);
            }
        };
        img.onerror = () => reject(new Error('Failed to load image for preprocessing'));
        img.src = dataUrl;
    });
}

function preprocessCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // 1. Grayscale
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

        // 2. Thresholding (Binarization)
        // Simple threshold at 140 (tweakable)
        const val = avg > 140 ? 255 : 0;

        data[i] = val;     // R
        data[i + 1] = val; // G
        data[i + 2] = val; // B
        // Alpha (data[i+3]) stays the same
    }

    ctx.putImageData(imageData, 0, 0);
}

// Offscreen Script - Handles Tesseract OCR

var ocrWorker = null;

// Initialize Tesseract worker with local paths
async function initTesseract() {
    if (ocrWorker) return ocrWorker;

    try {
        console.log('Offscreen: Initializing Tesseract worker from root...');

        // Configure Tesseract to use local files from the root
        // Critical for MV3: workerBlobURL: false
        ocrWorker = await Tesseract.createWorker('eng', 1, {
            workerPath: chrome.runtime.getURL('/tesseract-worker.min.js'),
            langPath: chrome.runtime.getURL('/'),
            corePath: chrome.runtime.getURL('/tesseract-core.wasm.js'),
            workerBlobURL: false,
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
        console.log('Offscreen: Loading image for processing with OpenCV...');
        var img = new Image();
        img.onload = function () {
            try {
                // Determine dimensions
                const width = captureData ? captureData.width : img.width;
                const height = captureData ? captureData.height : img.height;
                const x = captureData ? captureData.x : 0;
                const y = captureData ? captureData.y : 0;

                // Create initial canvas to extract pixels
                var srcCanvas = document.createElement('canvas');
                srcCanvas.width = width;
                srcCanvas.height = height;
                var srcCtx = srcCanvas.getContext('2d');
                srcCtx.drawImage(img, x, y, width, height, 0, 0, width, height);

                // Use OpenCV for high-quality preprocessing
                var mat = cv.imread(srcCanvas);

                // 1. Grayscale
                var gray = new cv.Mat();
                cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);

                // 2. Gaussian Blur (Reduce noise)
                var blurred = new cv.Mat();
                cv.GaussianBlur(gray, blurred, new cv.Size(3, 3), 0, 0, cv.BORDER_DEFAULT);

                // 3. Adaptive Thresholding (Handle shadows/gradients)
                var thresh = new cv.Mat();
                cv.adaptiveThreshold(blurred, thresh, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);

                // Render back to canvas (Upscaled x2 for better OCR)
                var finalCanvas = document.createElement('canvas');
                finalCanvas.width = width * 2;
                finalCanvas.height = height * 2;

                // Resize back to final canvas using OpenCV for better interpolation
                var upscaled = new cv.Mat();
                cv.resize(thresh, upscaled, new cv.Size(width * 2, height * 2), 0, 0, cv.INTER_CUBIC);

                cv.imshow(finalCanvas, upscaled);

                finalCanvas.toBlob(function (blob) {
                    if (!blob) {
                        reject(new Error('Failed to create blob from OpenCV canvas'));
                        return;
                    }
                    console.log('Offscreen: OpenCV Preprocessing complete, blob size:', blob.size);
                    resolve(blob);

                    // Cleanup Mats
                    mat.delete(); gray.delete(); blurred.delete(); thresh.delete(); upscaled.delete();
                }, 'image/png');
            } catch (e) {
                console.error('Offscreen: OpenCV Processing error:', e);
                reject(e);
            }
        };
        img.onerror = () => reject(new Error('Failed to load image for OpenCV processing'));
        img.src = dataUrl;
    });
}

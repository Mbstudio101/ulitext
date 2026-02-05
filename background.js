// Background Service Worker - OCR Processing & Auto-Update System

// Import Tesseract.js from local file (Manifest V3 doesn't allow external CDN)
importScripts('tesseract.min.js');

// Configuration
var UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
var UPDATE_URL = 'https://api.github.com/repos/Mbstudio101/ulitext/releases/latest';
var ENABLE_UPDATE_CHECKS = true;

// Global OCR worker
var ocrWorker = null;

// Initialize Tesseract worker with local paths
async function initTesseract() {
    if (ocrWorker) return ocrWorker;

    try {
        // Configure Tesseract to use local files
        ocrWorker = await Tesseract.createWorker('eng', 1, {
            workerPath: chrome.runtime.getURL('tesseract-data/tesseract-worker.min.js'),
            langPath: chrome.runtime.getURL('tesseract-data'),
            corePath: chrome.runtime.getURL('tesseract-data/tesseract-core.wasm.js')
        });
        console.log('Tesseract worker initialized with local files');
        return ocrWorker;
    } catch (error) {
        console.error('Failed to initialize Tesseract:', error);
        throw error;
    }
}

// Handle screenshot capture requests
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'captureScreenshot') {
        handleScreenshotCapture(request.data, sender.tab.id);
    }
});

async function handleScreenshotCapture(captureData, tabId) {
    try {
        // Notify user processing started
        notifyPopup({ action: 'ocrProgress', message: 'Capturing screenshot...' });

        // Capture visible tab
        var dataUrl = await chrome.tabs.captureVisibleTab({ format: 'png' });

        // Crop image to selection
        notifyPopup({ action: 'ocrProgress', message: 'Processing image...' });
        var croppedDataUrl = await cropImage(dataUrl, captureData);

        // Perform OCR
        notifyPopup({ action: 'ocrProgress', message: 'Extracting text...' });
        var text = await performOCR(croppedDataUrl);

        // Save result
        await chrome.storage.local.set({ lastOcrResult: text });

        // Copy to clipboard
        await copyToClipboard(text, tabId);

        // Show success notification
        showNotification('OCR Complete! ✓', text);

        // Notify popup
        notifyPopup({ action: 'ocrComplete', text: text });

    } catch (error) {
        console.error('Screenshot capture failed:', error);
        showNotification('OCR Failed', 'Error: ' + error.message, true);
        notifyPopup({ action: 'ocrError', error: error.message });
    }
}

function cropImage(dataUrl, captureData) {
    return new Promise(function (resolve, reject) {
        var img = new Image();

        img.onload = function () {
            var canvas = new OffscreenCanvas(captureData.width, captureData.height);
            var ctx = canvas.getContext('2d');

            ctx.drawImage(
                img,
                captureData.x, captureData.y,
                captureData.width, captureData.height,
                0, 0,
                captureData.width, captureData.height
            );

            canvas.convertToBlob({ type: 'image/png' }).then(function (blob) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    resolve(reader.result);
                };
                reader.readAsDataURL(blob);
            }).catch(reject);
        };

        img.onerror = function () {
            reject(new Error('Failed to load image'));
        };

        img.src = dataUrl;
    });
}

async function performOCR(imageDataUrl) {
    try {
        var worker = await initTesseract();
        var result = await worker.recognize(imageDataUrl);
        return result.data.text.trim();
    } catch (error) {
        console.error('OCR failed:', error);
        throw new Error('OCR processing failed');
    }
}

async function copyToClipboard(text, tabId) {
    try {
        // Inject a script to copy to clipboard (more reliable than offscreen document)
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: function (textToCopy) {
                navigator.clipboard.writeText(textToCopy);
            },
            args: [text]
        });
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
    }
}

function showNotification(title, message, isError) {
    var preview = message.length > 100 ? message.substring(0, 100) + '...' : message;

    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: title,
        message: preview,
        priority: isError ? 1 : 2
    });
}

function notifyPopup(message) {
    chrome.runtime.sendMessage(message).catch(function () {
        // Popup might be closed, ignore error
    });
}

// ============================================
// AUTO-UPDATE SYSTEM
// ============================================

async function checkForUpdates() {
    if (!ENABLE_UPDATE_CHECKS) return;

    try {
        // Get current version from manifest
        var currentVersion = chrome.runtime.getManifest().version;

        // Get last check time
        var storage = await chrome.storage.local.get('lastUpdateCheck');
        var lastUpdateCheck = storage.lastUpdateCheck;
        var now = Date.now();

        // Check if 24 hours have passed
        if (lastUpdateCheck && (now - lastUpdateCheck) < UPDATE_CHECK_INTERVAL) {
            console.log('Update check skipped - too soon');
            return;
        }

        // Fetch latest version from GitHub
        var response = await fetch(UPDATE_URL);

        if (!response.ok) {
            console.log('Update check failed - API error');
            return;
        }

        var data = await response.json();
        var latestVersion = data.tag_name.replace('v', '');

        // Compare versions
        if (isNewerVersion(latestVersion, currentVersion)) {
            // Store update info
            await chrome.storage.local.set({
                updateAvailable: true,
                latestVersion: latestVersion,
                releaseNotes: data.body || 'No release notes available',
                downloadUrl: data.html_url
            });

            // Show notification
            showUpdateNotification(latestVersion);

            // Set badge
            chrome.action.setBadgeText({ text: 'NEW' });
            chrome.action.setBadgeBackgroundColor({ color: '#10b981' });

            console.log('Update available:', latestVersion);
        } else {
            console.log('No update available. Current:', currentVersion, 'Latest:', latestVersion);
        }

        // Update last check time
        await chrome.storage.local.set({ lastUpdateCheck: now });

    } catch (error) {
        console.error('Update check failed:', error);
        // Silent failure - don't bother user
    }
}

function isNewerVersion(latest, current) {
    var latestParts = latest.split('.').map(Number);
    var currentParts = current.split('.').map(Number);

    for (var i = 0; i < 3; i++) {
        if (latestParts[i] > currentParts[i]) return true;
        if (latestParts[i] < currentParts[i]) return false;
    }
    return false;
}

function showUpdateNotification(version) {
    chrome.notifications.create('update-available', {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '📦 Update Available',
        message: 'Ulitext v' + version + ' is now available!',
        buttons: [
            { title: 'View Details' },
            { title: 'Dismiss' }
        ],
        priority: 2
    });
}

// Handle notification clicks
chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
    if (notifId === 'update-available') {
        if (btnIdx === 0) {
            // View Details
            chrome.storage.local.get(['downloadUrl'], function (result) {
                if (result.downloadUrl) {
                    chrome.tabs.create({ url: result.downloadUrl });
                }
            });
        }
        chrome.notifications.clear(notifId);
    }
});

chrome.notifications.onClicked.addListener(function (notifId) {
    if (notifId === 'update-available') {
        chrome.action.openPopup();
    }
});

// Check on extension install/update
chrome.runtime.onInstalled.addListener(function (details) {
    console.log('Extension installed/updated:', details.reason);

    if (details.reason === 'install') {
        console.log('First install - initializing...');
        checkForUpdates();
    } else if (details.reason === 'update') {
        console.log('Extension updated to:', chrome.runtime.getManifest().version);
        // Clear update banner since we just updated
        chrome.storage.local.set({ updateAvailable: false });
        checkForUpdates();
    }
});

// Set up periodic update checks (every 24 hours)
chrome.alarms.create('updateCheck', { periodInMinutes: 1440 });

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === 'updateCheck') {
        console.log('Running scheduled update check...');
        checkForUpdates();
    }
});

// Check on startup
checkForUpdates();

console.log('Ulitext background service worker loaded');

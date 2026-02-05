// Offscreen Document path
const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';

// Configuration
var UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
var UPDATE_URL = 'https://api.github.com/repos/Mbstudio101/ulitext/releases/latest';
var ENABLE_UPDATE_CHECKS = true;

// Handle messages from all parts of the extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'captureScreenshot') {
        // Acknowledge receipt immediately to content script
        sendResponse({ success: true, message: 'Processing capture request...' });

        // Handle capture asynchronously
        handleScreenshotCapture(request.data, sender.tab.id);
    }
    return true; // Keep message channel open for async response
});

async function handleScreenshotCapture(captureData, tabId) {
    console.log('Starting screenshot capture handle...', captureData);
    try {
        notifyPopup({ action: 'ocrProgress', message: 'Capturing screenshot...' });

        // Capture visible tab (returns Base64 Data URL)
        var dataUrl = await chrome.tabs.captureVisibleTab({ format: 'png' });
        console.log('Full screenshot captured (length: ' + dataUrl.length + ')');

        // Ensure Offscreen Document exists
        notifyPopup({ action: 'ocrProgress', message: 'Preparing OCR engine...' });
        await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

        // Hand off EVERYTHING (cropping + OCR) to the offscreen document
        // This avoids all SW restrictions (Image, Canvas, URL.createObjectURL, Worker)
        notifyPopup({ action: 'ocrProgress', message: 'Extracting text...' });

        console.log('Sending data to offscreen document...');
        var response = await chrome.runtime.sendMessage({
            action: 'performOCR',
            data: {
                dataUrl: dataUrl,
                captureData: captureData
            }
        });

        if (!response || !response.success) {
            throw new Error(response ? response.error : 'No response from OCR engine');
        }

        var text = response.text;
        console.log('OCR Complete! Result length:', text.length);

        // Save result to storage
        await chrome.storage.local.set({ lastOcrResult: text });

        // Copy to clipboard
        await copyToClipboard(text, tabId);

        // Show success notification
        showNotification('OCR Complete! ✓', text);

        // Notify popup (if it's still open)
        notifyPopup({ action: 'ocrComplete', text: text });

    } catch (error) {
        console.error('OCR Pipeline failed:', error);
        showNotification('OCR Failed', 'Error: ' + error.message, true);
        notifyPopup({ action: 'ocrError', error: error.message });
    }
}

async function setupOffscreenDocument(path) {
    if (await chrome.offscreen.hasDocument()) return;

    await chrome.offscreen.createDocument({
        url: path,
        reasons: ['WORKERS', 'DOM_SCRAPING'],
        justification: 'Tesseract.js requires Web Workers and Canvas which are restricted in Service Workers'
    });
}

async function copyToClipboard(text, tabId) {
    if (!text) return;
    try {
        console.log('Attempting to copy to clipboard...');
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: function (textToCopy) {
                try {
                    // Fallback: Create a hidden textarea and use execCommand('copy')
                    var textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    console.log('Copied to clipboard via fallback method');
                } catch (e) {
                    // Modern Clipboard API
                    navigator.clipboard.writeText(textToCopy);
                    console.log('Copied to clipboard via navigator.clipboard');
                }
            },
            args: [text]
        });
    } catch (error) {
        console.warn('Clipboard copy script failed (might be a restricted page):', error);
    }
}

function showNotification(title, message, isError) {
    var preview = message ? (message.length > 100 ? message.substring(0, 100) + '...' : message) : 'No text extracted';

    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: title,
        message: preview,
        priority: isError ? 1 : 2
    });
}

function notifyPopup(message) {
    console.log('Notifying popup:', message.action, message.message || '');
    chrome.runtime.sendMessage(message).catch(function () {
        // Popup might be closed, this is normal
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

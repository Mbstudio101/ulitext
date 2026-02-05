// Popup Script - UI Handlers

(function () {
    'use strict';

    var captureBtn = document.getElementById('captureBtn');
    var copyBtn = document.getElementById('copyBtn');
    var resultText = document.getElementById('resultText');
    var statusDiv = document.getElementById('status');
    var statusText = document.getElementById('statusText');
    var versionSpan = document.getElementById('version');
    var updateBanner = document.getElementById('updateBanner');
    var updateVersion = document.getElementById('updateVersion');
    var updateMessage = document.getElementById('updateMessage');
    var viewReleaseBtn = document.getElementById('viewReleaseBtn');
    var dismissUpdateBtn = document.getElementById('dismissUpdateBtn');
    var openSidePanelBtn = document.getElementById('openSidePanelBtn');
    var fileOcrBtn = document.getElementById('fileOcrBtn');
    var fileInput = document.getElementById('fileInput');

    // Load version from manifest
    var manifest = chrome.runtime.getManifest();
    versionSpan.textContent = manifest.version;

    // Load last result and check current status
    chrome.storage.local.get(['lastOcrResult', 'ocrStatus', 'lastOcrError'], function (result) {
        console.log('Popup: Initial load, status:', result.ocrStatus);

        if (result.ocrStatus === 'processing') {
            showStatus('OCR in progress...', 'info');
            resultText.value = '';
            resultText.placeholder = 'Processing your selection...';
        } else if (result.ocrStatus === 'error') {
            showStatus('Error: ' + (result.lastOcrError || 'Unknown error'), 'error');
        } else if (result.lastOcrResult) {
            resultText.value = result.lastOcrResult;
        }
    });

    // Watch for storage changes (handles updates while popup is open)
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace !== 'local') return;

        if (changes.lastOcrResult) {
            console.log('Popup: Result updated in storage');
            resultText.value = changes.lastOcrResult.newValue;
        }

        if (changes.ocrStatus) {
            console.log('Popup: Status changed to:', changes.ocrStatus.newValue);
            if (changes.ocrStatus.newValue === 'processing') {
                showStatus('OCR in progress...', 'info');
                resultText.value = '';
            } else if (changes.ocrStatus.newValue === 'idle') {
                showStatus('OCR Complete! ✓', 'success');
            } else if (changes.ocrStatus.newValue === 'error') {
                // Error handled via lastOcrError change
            }
        }
    });

    // Check for updates
    chrome.storage.local.get(['updateAvailable', 'latestVersion', 'releaseNotes', 'downloadUrl'], function (result) {
        if (result.updateAvailable) {
            updateBanner.style.display = 'block';
            updateVersion.textContent = result.latestVersion || 'Unknown';

            viewReleaseBtn.addEventListener('click', function () {
                if (result.downloadUrl) {
                    chrome.tabs.create({ url: result.downloadUrl });
                }
            });

            dismissUpdateBtn.addEventListener('click', function () {
                updateBanner.style.display = 'none';
                chrome.storage.local.set({ updateAvailable: false });
            });
        }
    });

    // Capture button click
    captureBtn.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                var tab = tabs[0];

                // Check if page is restricted
                if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://'))) {
                    showStatus('Error: Cannot capture on browser internal pages', 'error');
                    return;
                }

                // Clear previous result and show starting state
                resultText.value = '';
                showStatus('Preparing capture...', 'info');

                // Try to send message to content script
                chrome.tabs.sendMessage(tab.id, { action: 'startCapture' }, function (response) {
                    if (chrome.runtime.lastError) {
                        // Content script not loaded, inject it programmatically
                        console.log('Popup: Content script not loaded, injecting...');
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ['content.js']
                        }, function () {
                            if (chrome.runtime.lastError) {
                                showStatus('Error: Unable to inject content script.', 'error');
                                return;
                            }

                            // Also inject CSS
                            chrome.scripting.insertCSS({
                                target: { tabId: tab.id },
                                files: ['content.css']
                            }, function () {
                                // Now try sending the message again
                                setTimeout(function () {
                                    chrome.tabs.sendMessage(tab.id, { action: 'startCapture' }, function (response) {
                                        if (chrome.runtime.lastError) {
                                            showStatus('Error: Capture start failed', 'error');
                                        } else {
                                            showStatus('Select area on page...', 'info');
                                        }
                                    });
                                }, 150);
                            });
                        });
                    } else {
                        showStatus('Select area on page...', 'info');
                        // Close popup so user can see the overlay (optional, but standard for these tools)
                        // setTimeout(() => window.close(), 1000); 
                    }
                });
            }
        });
    });

    // Open Side Panel
    openSidePanelBtn.addEventListener('click', function () {
        chrome.runtime.sendMessage({ action: 'openSidePanel' });
    });

    // File OCR
    fileOcrBtn.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function (event) {
            var dataUrl = event.target.result;
            showStatus('Processing file...', 'info');
            chrome.runtime.sendMessage({
                action: 'captureScreenshot', // We reuse the same handler
                data: {
                    dataUrl: dataUrl,
                    captureData: null // No crop data means process whole image
                }
            });
        };
        reader.readAsDataURL(file);
    });

    // Copy button click
    copyBtn.addEventListener('click', function () {
        var text = resultText.value;
        if (text) {
            navigator.clipboard.writeText(text).then(function () {
                copyBtn.textContent = '✓ Copied!';
                copyBtn.classList.add('copied');
                setTimeout(function () {
                    copyBtn.textContent = 'Copy to Clipboard';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(function (err) {
                showStatus('Failed to copy: ' + err.message, 'error');
            });
        }
    });

    // Listen for OCR results
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log('Popup: Received message:', request.action);
        if (request.action === 'ocrComplete') {
            var text = request.text || ' (No text detected) ';
            console.log('Popup: OCR Complete, text length:', text.length);
            resultText.value = text;
            showStatus('OCR Complete! ✓', 'success');
        } else if (request.action === 'ocrError') {
            console.error('Popup: OCR Error:', request.error);
            showStatus('Error: ' + request.error, 'error');
        } else if (request.action === 'ocrProgress') {
            console.log('Popup: Progress:', request.message);
            showStatus(request.message, 'info');
        }
    });

    function showStatus(message, type) {
        statusText.textContent = message;
        statusDiv.className = 'status ' + (type || 'info');
        statusDiv.style.display = 'flex';

        if (type === 'success' || type === 'error') {
            setTimeout(function () {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
})();

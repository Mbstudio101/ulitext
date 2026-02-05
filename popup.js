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

    // Load version from manifest
    var manifest = chrome.runtime.getManifest();
    versionSpan.textContent = manifest.version;

    // Load last result from storage
    chrome.storage.local.get(['lastOcrResult'], function (result) {
        if (result.lastOcrResult) {
            resultText.value = result.lastOcrResult;
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

                // Try to send message to content script
                chrome.tabs.sendMessage(tab.id, { action: 'startCapture' }, function (response) {
                    if (chrome.runtime.lastError) {
                        // Content script not loaded, inject it programmatically
                        console.log('Content script not loaded, injecting programmatically...');
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ['content.js']
                        }, function () {
                            if (chrome.runtime.lastError) {
                                showStatus('Error: Unable to inject content script. Try reloading the page.', 'error');
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
                                            showStatus('Error: Content script injection failed', 'error');
                                        } else {
                                            showStatus('Starting capture...', 'info');
                                        }
                                    });
                                }, 100);
                            });
                        });
                    } else {
                        showStatus('Starting capture...', 'info');
                    }
                });
            }
        });
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

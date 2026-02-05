// Content Script - Screenshot Selection Overlay (ES5 Compatible)

(function () {
    'use strict';

    var overlay = null;
    var selectionBox = null;
    var instructions = null;
    var startX = 0;
    var startY = 0;
    var isSelecting = false;

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.action === 'startCapture') {
            startCapture();
            sendResponse({ success: true });
        }
        return true;
    });

    function startCapture() {
        if (overlay) {
            cleanup();
        }
        createOverlay();
    }

    function createOverlay() {
        // Create dimmed overlay
        overlay = document.createElement('div');
        overlay.className = 'ocr-overlay';

        // Create selection box
        selectionBox = document.createElement('div');
        selectionBox.className = 'ocr-selection-box';
        selectionBox.style.display = 'none';

        // Create instructions
        instructions = document.createElement('div');
        instructions.className = 'ocr-instructions';
        instructions.textContent = 'Click and drag to select area • Press ESC to cancel';

        document.body.appendChild(overlay);
        document.body.appendChild(selectionBox);
        document.body.appendChild(instructions);

        // Add event listeners
        overlay.addEventListener('mousedown', onMouseDown);
        overlay.addEventListener('mousemove', onMouseMove);
        overlay.addEventListener('mouseup', onMouseUp);
        document.addEventListener('keydown', onKeyDown);
    }

    function onMouseDown(e) {
        isSelecting = true;
        startX = e.clientX;
        startY = e.clientY;

        selectionBox.style.left = startX + 'px';
        selectionBox.style.top = startY + 'px';
        selectionBox.style.width = '0px';
        selectionBox.style.height = '0px';
        selectionBox.style.display = 'block';
    }

    function onMouseMove(e) {
        if (!isSelecting) return;

        var currentX = e.clientX;
        var currentY = e.clientY;

        var left = Math.min(startX, currentX);
        var top = Math.min(startY, currentY);
        var width = Math.abs(currentX - startX);
        var height = Math.abs(currentY - startY);

        selectionBox.style.left = left + 'px';
        selectionBox.style.top = top + 'px';
        selectionBox.style.width = width + 'px';
        selectionBox.style.height = height + 'px';
    }

    function onMouseUp(e) {
        if (!isSelecting) return;
        isSelecting = false;

        var currentX = e.clientX;
        var currentY = e.clientY;

        var left = Math.min(startX, currentX);
        var top = Math.min(startY, currentY);
        var width = Math.abs(currentX - startX);
        var height = Math.abs(currentY - startY);

        // Check minimum size
        if (width < 10 || height < 10) {
            cleanup();
            return;
        }

        // Get device pixel ratio for high-DPI displays
        var dpr = window.devicePixelRatio || 1;

        // Calculate coordinates with DPI scaling
        var captureData = {
            x: left * dpr,
            y: top * dpr,
            width: width * dpr,
            height: height * dpr
        };

        // Clean up overlay before capture
        cleanup();

        // Send capture request to background and handle response
        chrome.runtime.sendMessage({
            action: 'captureScreenshot',
            data: captureData
        }, function (response) {
            if (chrome.runtime.lastError) {
                console.error('Failed to send capture request:', chrome.runtime.lastError);
                alert('Failed to capture screenshot. Please try again.');
            } else if (response && response.success) {
                console.log('Capture request sent successfully');
            } else if (response && response.error) {
                console.error('Capture failed:', response.error);
                alert('Capture failed: ' + response.error);
            }
        });
    }

    function onKeyDown(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            cleanup();
        }
    }

    function cleanup() {
        if (overlay) {
            overlay.removeEventListener('mousedown', onMouseDown);
            overlay.removeEventListener('mousemove', onMouseMove);
            overlay.removeEventListener('mouseup', onMouseUp);
            overlay.remove();
            overlay = null;
        }

        if (selectionBox) {
            selectionBox.remove();
            selectionBox = null;
        }

        if (instructions) {
            instructions.remove();
            instructions = null;
        }

        document.removeEventListener('keydown', onKeyDown);
        isSelecting = false;
    }
})();

function loadHistory() {
    chrome.storage.local.get(['ocrHistory'], function (data) {
        const list = document.getElementById('historyList');
        list.innerHTML = '';
        const history = data.ocrHistory || [];

        if (history.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:#999;">No history yet</p>';
            return;
        }

        history.slice().reverse().forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';

            // Escape text for different contexts
            const safeText = item.text.replace(/'/g, "\\'").replace(/\n/g, ' ');
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.text)}`;

            div.innerHTML = `
                <div class="history-text">${item.text}</div>
                <div class="history-meta">
                    <span>${new Date(item.timestamp).toLocaleString()}</span>
                    <div style="display: flex; gap: 4px;">
                        <button onclick="copyText('${safeText}')">Copy</button>
                        <button onclick="window.open('${searchUrl}', '_blank')">Find Answer</button>
                    </div>
                </div>
            `;
            list.appendChild(div);
        });
    });
}

function copyText(text) {
    navigator.clipboard.writeText(text);
}

// Watch for changes to update list real-time
chrome.storage.onChanged.addListener((changes) => {
    if (changes.ocrHistory) {
        loadHistory();
    }
});

document.addEventListener('DOMContentLoaded', loadHistory);

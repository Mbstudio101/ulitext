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
            div.innerHTML = `
                <div class="history-text">${item.text}</div>
                <div class="history-meta">
                    <span>${new Date(item.timestamp).toLocaleString()}</span>
                    <button onclick="copyText('${item.text.replace(/'/g, "\\'")}')">Copy</button>
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

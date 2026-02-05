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
            const hasAnswer = !!item.answer;

            div.innerHTML = `
                <div class="history-text">${item.text}</div>
                <div id="loading-${item.timestamp}" class="loading-spinner">Analyzing question...</div>
                <div id="answer-${item.timestamp}" class="answer-box ${hasAnswer ? 'visible' : ''}">
                    <strong>Dashboard Answer:</strong><br>${item.answer || ''}
                </div>
                <div class="history-meta">
                    <span>${new Date(item.timestamp).toLocaleString()}</span>
                    <div style="display: flex; gap: 4px;">
                        <button onclick="copyText('${safeText}')">Copy</button>
                        <button onclick="getAnswer(${item.timestamp}, '${safeText}')" ${hasAnswer ? 'style="display:none"' : ''} id="btn-${item.timestamp}">Get Answer</button>
                        <button onclick="window.open('${searchUrl}', '_blank')">View Search</button>
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

function getAnswer(timestamp, text) {
    document.getElementById(`loading-${timestamp}`).style.display = 'block';
    document.getElementById(`btn-${timestamp}`).disabled = true;

    chrome.runtime.sendMessage({
        action: 'getAnswerForHistory',
        text: text,
        timestamp: timestamp
    });
}

// Watch for changes to update list real-time
chrome.storage.onChanged.addListener((changes) => {
    if (changes.ocrHistory) {
        loadHistory();
    }
});

document.addEventListener('DOMContentLoaded', loadHistory);

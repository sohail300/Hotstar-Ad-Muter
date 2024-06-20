document.getElementById('mute').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.update(tabs[0].id, { muted: true });
    });
});

document.getElementById('unmute').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.update(tabs[0].id, { muted: false });
    });
});

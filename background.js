chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('inside bg')
    if (request.action === "mute") {
        chrome.tabs.update(sender.tab.id, { muted: true });
    } else if (request.action === "unmute") {
        chrome.tabs.update(sender.tab.id, { muted: false });
    }
});

let previousIsVideoBlock = false;
let lastVideoRequestTime = 0;
let lastAdRequestTime = 0;
const interval = 4000; // 4 seconds interval to prevent rapid state changes

function printTime() {
    const now = new Date();
    let formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
    return formattedTime;
}

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.url.includes("https://hf-apix.hotstar.com")) {
            const currentTime = Date.now();
            if (currentTime - lastVideoRequestTime < interval) return;
            lastVideoRequestTime = currentTime;

            console.log("Video request intercepted: " + printTime() + " | ID: " + details.requestId);

            chrome.tabs.get(details.tabId, function (tab) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                } else {
                    console.log("previousIsVideoBlock before checking: ", previousIsVideoBlock);
                    if (tab.mutedInfo && tab.mutedInfo.muted && previousIsVideoBlock) {
                        chrome.tabs.update(details.tabId, { muted: false }, function () {
                            console.log("Tab unmuted: " + printTime() + " | ID: " + details.requestId);
                        });
                    }
                    previousIsVideoBlock = true;
                    console.log("previousIsVideoBlock set to true | ID: " + details.requestId);
                }
            });
        }
    },
    { urls: ["<all_urls>"] }
);

chrome.webRequest.onResponseStarted.addListener(
    function (details) {
        if (details.url.includes("https://service.hotstar.com")) {
            const currentTime = Date.now();
            if (currentTime - lastAdRequestTime < interval) return;
            lastAdRequestTime = currentTime;

            previousIsVideoBlock = false;
            console.log("Ad request intercepted: " + printTime() + " | ID: " + details.requestId);
            console.log("previousIsVideoBlock set to false | ID: " + details.requestId);

            setTimeout(() => {
                chrome.tabs.get(details.tabId, function (tab) {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    } else {
                        chrome.tabs.update(details.tabId, { muted: true }, function () {
                            console.log('Tab muted: ' + printTime() + " | ID: " + details.requestId);
                        });
                    }
                });
            }, 8000); // Adjust the delay as needed
        }
    },
    { urls: ["<all_urls>"] }
);

console.log("Background script loaded");
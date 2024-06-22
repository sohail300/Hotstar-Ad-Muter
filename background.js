let isAdShowing = false;
let lastVideoRequestTime = 0;
let lastAdRequestTime = 0;
const interval = 4000;

function printTime() {
    const now = new Date();
    let formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
    return formattedTime;
}

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.url.includes("https://hf-apix.hotstar.com")) {
            isAdShowing = false;
            console.log("isAdShowing is set to false | ID: " + details.requestId);

            const currentTime = Date.now();
            if (currentTime - lastVideoRequestTime < interval) return;
            lastVideoRequestTime = currentTime;

            console.log("Video request intercepted: " + printTime() + " | ID: " + details.requestId);

            chrome.tabs.get(details.tabId, function (tab) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                } else {
                    console.log("isAdShowing before checking: ", isAdShowing);
                    setTimeout(() => {
                        if (tab.mutedInfo && tab.mutedInfo.muted && !isAdShowing) {
                            chrome.tabs.update(details.tabId, { muted: false }, function () {
                                console.log("Tab unmuted: " + printTime() + " | ID: " + details.requestId);
                            });
                        }
                    }, 12000)
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

            isAdShowing = true;
            console.log("Ad request intercepted: " + printTime() + " | ID: " + details.requestId);
            console.log("isAdShowing set to true | ID: " + details.requestId);

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
            }, 10000); // Adjust the delay as needed
        }
    },
    { urls: ["<all_urls>"] }
);

console.log("Background script loaded");
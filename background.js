// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log('inside bg')
//     if (request.action === "mute") {
//         chrome.tabs.update(sender.tab.id, { muted: true });
//     } else if (request.action === "unmute") {
//         chrome.tabs.update(sender.tab.id, { muted: false });
//     }
// });

console.log("Background script loaded");

function notifyAdDetected(url) {
    console.log("Attempting to notify about URL: " + url);
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",  // Ensure you have an icon.png file in your extension directory
        title: "Ad Detected",
        message: "An ad was detected at " + url
    }, function (notificationId) {
        if (chrome.runtime.lastError) {
            console.error("Notification error:", chrome.runtime.lastError);
        } else {
            console.log("Notification displayed with ID:", notificationId);
        }
    });
}

// chrome.webRequest.onCompleted.addListener(
//     function (details) {
//         // if (details.url.includes("https://www.hotstar.com")) {
//         //     console.log("Ad detected with URL: " + details.url);
//         //     notifyAdDetected(details.url);
//         // }
//         console.log("Request completed:", details);
//     },
//     { urls: ["https://hf-apix.hotstar.com/*"] }
// );

// chrome.webRequest.onBeforeRequest.addListener(
//     function (details) {
//         // if (details.url.includes("https://www.hotstar.com")) {
//         //     console.log("Ad request intercepted: " + details.url);
//         //     notifyAdDetected(details.url);
//         // }
//         console.log("Request completed:", details);
//     },
//     { urls: ["https://hf-apix.hotstar.com/*"] }
// );

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        console.log("Request completed:", details);
    },
    { urls: ["<all_urls>"] }
);

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.url.includes("https://hf-apix.hotstar.com")) {
            console.log("Video request intercepted: " + details.url);
            notifyAdDetected(details.url);
        }
    },
    { urls: ["<all_urls>"] }
);

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.url.includes("https://service.hotstar.com")) {
            console.log("Ad request intercepted: " + details.url);
            // notifyAdDetected(details.url);
        }
    },
    { urls: ["<all_urls>"] }
);
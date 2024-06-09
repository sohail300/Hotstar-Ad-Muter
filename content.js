const AD_DIV_SELECTOR = "_1GyF_i9b6_XmG3IxgNlj4H";

const checkForAds = () => {
    let isAdRunning = false;

    setInterval(() => {
        const adDiv = document.getElementsByClassName(AD_DIV_SELECTOR);
        if (adDiv) {
            if (!isAdRunning) {
                isAdRunning = true;
                chrome.runtime.sendMessage({ action: "mute" });
            }
        } else if (isAdRunning) {
            // Gap b/w each ad is somewhat around 8 seconds, where ad-div may not be found
            setTimeout(() => {
                if (!document.getElementsByClassName(AD_DIV_SELECTOR)) {
                    isAdRunning = false;
                    chrome.runtime.sendMessage({ action: "unmute" });
                }
            }, 8000);
        }
    }, 500);
};

const adDetectionInterval = setInterval(() => {
    if (document.readyState === 'complete') {
        checkForAds();
        clearInterval(adDetectionInterval);
    }
}, 1000);

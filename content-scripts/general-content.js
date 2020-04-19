
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        sendResponse(null);
    }
);
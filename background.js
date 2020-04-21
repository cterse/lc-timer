chrome.runtime.onInstalled.addListener(function(details) {
    console.log("Extension installed");

    console.log("Clearing sync storage...");
    chrome.storage.sync.clear();
    console.log("sync storage cleared.");
});
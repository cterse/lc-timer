chrome.runtime.onInstalled.addListener(function(details) {
    alert("Extension Installed")
    console.log("Extension installed")

    var rule1 = {
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {
                    hostContains: "leetcode.com"
                }
            })
        ],
        actions: [
            new chrome.declarativeContent.ShowPageAction()
        ]
    }

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([rule1]);
    });

});
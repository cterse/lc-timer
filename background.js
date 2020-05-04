chrome.runtime.onInstalled.addListener(function(details) {
    console.log("Extension installed");

    console.log("Clearing sync storage...");
    chrome.storage.sync.clear();
    console.log("sync storage cleared.");
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes && changes.problem_collection_obj && changes.problem_collection_obj.newValue) {
        let problemCountObj = getActiveCompleteProblemsCountObject(changes.problem_collection_obj.newValue);

        if (problemCountObj) {
            if (problemCountObj.activeCount === 0) chrome.browserAction.setBadgeText({text: ""});
            if (problemCountObj.activeCount > 999) chrome.browserAction.setBadgeText({text: "999+"});
            else chrome.browserAction.setBadgeText({text: problemCountObj.activeCount.toString()});
        }
    }
});

function getActiveCompleteProblemsCountObject(problemCollectionObj) {
    if (!problemCollectionObj) return 0;

    let activeCount = 0, completeCount = 0;
    for (var key in problemCollectionObj) {
        if (problemCollectionObj.hasOwnProperty(key)) {
            if (problemCollectionObj[key]) {
                if (problemCollectionObj[key].status == "active") activeCount++;
                if (problemCollectionObj[key].status == "complete") completeCount++;
            }
        }
    }

    return {"activeCount": activeCount, "completeCount": completeCount};
}

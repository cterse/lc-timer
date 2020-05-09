chrome.runtime.onInstalled.addListener(function(details) {
    const CLEAR_STORAGE_ON_UPDATE = true;
    const ADVANCE_PROBLEM_ACTIVE_TIME = false;
    const ADVANCE_PROBLEM_TIME_OBJ = {d:120, h:1, m:0, s:0};

    if (CLEAR_STORAGE_ON_UPDATE) {
        console.log("Clearing sync storage...");
        chrome.storage.sync.clear();
        console.log("sync storage cleared.");
    } else {
        chrome.storage.sync.get([constants.STORAGE_PROBLEM_COLLECTION], function(result) {
            let problemCollectionObject = result[constants.STORAGE_PROBLEM_COLLECTION];
            if (!result || !problemCollectionObject) {
                console.error("lc-timer:setupSubmitScript: Error retrieving problems from storage.");
                return null;
            }

            updateBadgeText(problemCollectionObject);

            if(ADVANCE_PROBLEM_ACTIVE_TIME) {
                // Advance problem active time for testing
                for (var key in problemCollectionObject) {
                    if (!problemCollectionObject.hasOwnProperty(key)) continue;
                    let updatedproblem = advanceProblemActiveTime(problemCollectionObject[key], ADVANCE_PROBLEM_TIME_OBJ);
                    console.dir(updatedproblem);
                }

                chrome.storage.sync.set({[constants.STORAGE_PROBLEM_COLLECTION]:  problemCollectionObject}, function() {
                    console.debug('advanced problem active time by: ' + JSON.stringify(ADVANCE_PROBLEM_TIME_OBJ));
                });
            }
        });
    }
    
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes && changes.problem_collection_obj && changes.problem_collection_obj.newValue) {
        updateBadgeText(changes.problem_collection_obj.newValue);
    }
});

function updateBadgeText(problemCollectionObject) {
    let badgeText = '';

    if (!problemCollectionObject) badgeText = '';

    let problemCountObj = getActiveCompleteProblemsCountObject(problemCollectionObject);

    if (problemCountObj) {
        if (problemCountObj.activeCount === 0) badgeText = '';
        else if (problemCountObj.activeCount > 999) badgeText = "999+";
        else badgeText = problemCountObj.activeCount.toString();
    }

    chrome.browserAction.setBadgeText({text: badgeText});
    return badgeText;
}

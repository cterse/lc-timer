let pageInitInterval = setInterval(setupMonitoringScript, 100);

function setupMonitoringScript() {
    if ($(constants.PROBLEM_TITLE_SELECTOR).length) {
        clearInterval(pageInitInterval);
        
        let prob_obj = createProblemObject(new Date().getTime());

        chrome.storage.sync.get([constants.STORAGE_PROBLEM_COLLECTION], function(result){
            if (!result) {
                console.error("lc-timer:problem-content : Error getting result from sync.");
                return null;
            }
            
            problemsCollection = {};
            if (result.problem_collection_obj) {
                problemsCollection = result.problem_collection_obj;
            }

            let storageUpdated = false;
            if (!problemsCollection[prob_obj.code]) {
                console.debug("lc-timer:problem=content : Problem does not exist in storage, adding it.");
                problemsCollection[prob_obj.code] = prob_obj;
                storageUpdated = true;
            } else {
                if (isProblemComplete(problemsCollection[prob_obj.code])) {
                    console.debug("lc-timer:problem=content : Completed problem exists, adding a new session.");
                    startNewSessionForProblem(problemsCollection[prob_obj.code]);
                    storageUpdated = true;
                } else {
                    console.debug("lc-timer:problem=content : Problem already active.");
                }
            }
            
            if(storageUpdated) {
                chrome.storage.sync.set({[constants.STORAGE_PROBLEM_COLLECTION]:  problemsCollection}, function(){
                    console.debug("lc-timer:problem=content : set data to storage.");
                    console.dir(problemsCollection);
                });
            }
        });
    }
}
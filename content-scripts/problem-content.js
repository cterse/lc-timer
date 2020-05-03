let pageInitInterval = setInterval(setupMonitoringScript, 100);

function setupMonitoringScript() {
    if ($(constants.PROBLEM_TITLE_SELECTOR).length) {
        clearInterval(pageInitInterval);
        
        let prob_obj = createProblemObject(new Date().getTime());

        chrome.storage.sync.get([constants.STORAGE_PROBLEM_COLLECTION], function(result){
            if (!result) {
                console.error("lc-timer:setupMonitoringScript: Error getting result from sync.");
                return null;
            }
            
            problemsCollection = {};
            if (result.problem_collection_obj) {
                problemsCollection = result.problem_collection_obj;
            }

            /*
                If problem does not exist in storage, add the problem object. 
                If problem exists in storage and
                    status = active, do not update the problem object in the storage.
                    status = complete, add a new session to the problem object.
            */
            let storageUpdated = false;
            if (!problemsCollection[prob_obj.code]) {
                console.debug("lc-timer:content: Problem does not exist in storage, adding it.");
                problemsCollection[prob_obj.code] = prob_obj;
                storageUpdated = true;
            } else {
                if (getProblemStatus(problemsCollection[prob_obj.code]) == constants.PROBLEM_STATUS_COMPLETE) {
                    console.debug("lc-timer:content: Completed problem exists, adding a new session.");
                    startNewSessionForProblem(problemsCollection[prob_obj.code]);
                    storageUpdated = true;
                } else {
                    console.debug("lc-timer:content: Problem already active.");
                }
            }
            
            if(storageUpdated)
                chrome.storage.sync.set({[constants.STORAGE_PROBLEM_COLLECTION]:  problemsCollection}, function(){
                    console.debug("lc-timer:setupMonitoringScript: set data to storage.");
                    console.dir(problemsCollection);
                });
        });
    }
}
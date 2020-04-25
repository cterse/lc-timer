window.onload = function() {
    let pageInitInterval = setInterval(setupMonitoringScript, 100);
    let prob_obj = null;

    function setupMonitoringScript() {
        if (document.querySelector("div[data-cy=question-title]")) {
            clearInterval(pageInitInterval);
            
            prob_obj = createProblemObject(new Date().getTime());

            chrome.storage.sync.get("problem_collection_obj", function(result){
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
                    if (getProblemStatus(problemsCollection[prob_obj.code]) == PROBLEM_STATUS_COMPLETE) {
                        console.debug("lc-timer:content: Completed problem exists, adding a new session.");
                        startNewSessionForProblem(problemsCollection[prob_obj.code]);
                        storageUpdated = true;
                    } else {
                        console.debug("lc-timer:content: Problem already active.");
                    }
                }
                
                if(storageUpdated)
                    chrome.storage.sync.set({"problem_collection_obj":  problemsCollection}, function(){
                        console.debug("lc-timer:setupMonitoringScript: set data to storage.");
                        console.dir(problemsCollection);
                    });
            });
        }
    }

    let submitButtonInterval = setInterval(setupSubmitScript, 100);

    function setupSubmitScript() {
        if (document.querySelector("button[data-cy=submit-code-btn]")) {
            clearInterval(submitButtonInterval);

            document.querySelector("button[data-cy=submit-code-btn]").onclick = function() {
                let submissionProcessingInterval = setInterval(validateSubmissionAndProceed, 100);
            
                function validateSubmissionAndProceed() {
                    if (document.getElementsByClassName("success__3Ai7").length > 0) {
                        clearInterval(submissionProcessingInterval);
        
                        //add end timestamp to problem's latest session in storage
                        console.debug("lc-timer:setupSubmitScript: Submission Success. Adding end timestamp.");
                        chrome.storage.sync.get("problem_collection_obj", function(result) {
                            if (!result || !result.problem_collection_obj) {
                                console.error("lc-timer:setupSubmitScript: Error retrieving problems from storage.");
                                return null;
                            }
                            
                            result.problem_collection_obj[prob_obj.code] = completeActiveProblem(result.problem_collection_obj[prob_obj.code]);
                            
                            chrome.storage.sync.set({"problem_collection_obj": result.problem_collection_obj}, function () {
                                console.debug("lc-timer:setupSubmitScript: Added end timestamp to problem.");
                            });
                        });
                    }
                }
            }
        }
    }

};
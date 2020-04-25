window.onload = function() {
    let pageInitInterval = setInterval(setupMonitoringScript, 100);
    
    function setupMonitoringScript() {
        if (document.querySelector("div[data-cy=question-title]")) {
            clearInterval(pageInitInterval);

            prob_obj = getProblemObject(new Date().getTime());
            chrome.storage.sync.get("problem_collection_obj", function(result){
                if (!result) {
                    console.error("lc-timer:setupMonitoringScript: Error getting result from sync.");
                    return null;
                }
                
                problemsCollectionObject = {};
                if (result.problem_collection_obj) {
                    console.debug("lc-timer:setupMonitoringScript: Retrieving existing problem list from storage.");
                    problemsCollectionObject = result.problem_collection_obj;
                }
                problemsCollectionObject[prob_obj.code] = prob_obj;

                chrome.storage.sync.set({"problem_collection_obj":  problemsCollectionObject}, function(){
                    console.debug("lc-timer:setupMonitoringScript: set data to storage.")
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
        
                        //add end timestamp to problem in storage
                        console.debug("lc-timer:setupSubmitScript: Submission Success. Adding end timestamp.");
                        chrome.storage.sync.get("problem_collection_obj", function(result) {
                            if (!result || !result.problem_collection_obj) {
                                console.error("lc-timer:setupSubmitScript: Error retrieving problems from storage.");
                                return null;
                            }

                            result.problem_collection_obj[getProblemObject().code].end_ts = Date.now();
                            
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
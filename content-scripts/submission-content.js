let submitButtonInterval = setInterval(setupSubmitScript, 100);

function setupSubmitScript() {
    if ($(constants.SUBMIT_BUTTON_SELECTOR).length) {
        clearInterval(submitButtonInterval);

        $(constants.SUBMIT_BUTTON_SELECTOR).click( function() {
            let submissionProcessingInterval = setInterval(validateSubmissionAndProceed, 100);
        
            function validateSubmissionAndProceed() {
                if ($(constants.SUBMISSION_SUCCESS_DIV_CLASS_SELECTOR).length) {
                    clearInterval(submissionProcessingInterval);
    
                    //add end timestamp to problem's latest session in storage
                    console.debug("lc-timer:setupSubmitScript: Submission Success. Adding end timestamp.");
                    chrome.storage.sync.get([constants.STORAGE_PROBLEM_COLLECTION], function(result) {
                        if (!result || !result.problem_collection_obj) {
                            console.error("lc-timer:setupSubmitScript: Error retrieving problems from storage.");
                            return null;
                        }
                        
                        let currentProblemCode = extractProblemCode();
                        result.problem_collection_obj[currentProblemCode] = completeActiveProblem(result.problem_collection_obj[currentProblemCode]);
                        
                        chrome.storage.sync.set({[constants.STORAGE_PROBLEM_COLLECTION]: result.problem_collection_obj}, function () {
                            console.debug("lc-timer:setupSubmitScript: Added end timestamp to problem.");
                        });
                    });
                }
            }
        });
    }
}
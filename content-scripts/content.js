window.onload = function() {
    let pageInitInterval = setInterval(setupMonitoringScript, 100);
    
    function setupMonitoringScript() {
        if (document.querySelector("div[data-cy=question-title]")) {
            clearInterval(pageInitInterval);

            prob_obj = getProblemObject(new Date().getTime());
            chrome.storage.sync.get("problem_collection_obj", function(result){
                if (!result) {
                    console.error("Error getting result from sync.");
                    return null;
                }
                
                problemsCollectionObject = {};
                if (result.problem_collection_obj) {
                    console.debug("Retrieving existing problem list from storage.");
                    problemsCollectionObject = result.problem_collection_obj;
                }
                problemsCollectionObject[prob_obj.code] = prob_obj;

                chrome.storage.sync.set({"problem_collection_obj":  problemsCollectionObject}, function(){
                    console.debug("set data to storage.")
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
                        console.debug("Submission Success. Adding end timestamp.");
                        chrome.storage.sync.get("problem_collection_obj", function(result) {
                            if(result && result.problem_collection_obj) {
                                result.problem_collection_obj[getProblemObject().code].end_ts = Date.now();
                                
                                chrome.storage.sync.set({"problem_collection_obj": result.problem_collection_obj}, function () {
                                    console.debug("Added end timestamp to problem.");
                                });
                            } else {
                                console.error("Error retrieving problems from storage.");
                            }
                        });
                    }
                }
            }
        }
    }

};

function getProblemObject(init_timestamp) {
    problemTitleNode = document.querySelector("div[data-cy=question-title]");

    probObj = {code: null, name: null, init_ts: init_timestamp};

    if(!problemTitleNode){
        console.error("Error getting problem title node.");
    } else {
        probObj.code = problemTitleNode.innerText.split('.')[0].trim();
        probObj.name = problemTitleNode.innerText.split('.')[1].trim();
    }

    console.dir(probObj);
    return probObj;
}

function getProblemName() {
    return document.getElementsByTagName("title")[0].innerText;
}
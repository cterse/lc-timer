window.onload = function() {
    let jsInitInterval = setInterval(function() {
        if (document.querySelector("div[data-cy=question-title]")) {
            clearInterval(jsInitInterval);

            prob_obj = getProblemObject(new Date().getTime());
            chrome.storage.sync.get("probs_list", function(result){
                if (!result) {
                    console.error("Error getting result from sync.");
                    return null;
                }
                
                problemList = [];
                if (result.probs_list) {
                    console.debug("Retrieving existing problem list from storage.");
                    problemList = result.probs_list;
                }
                problemList.push(prob_obj);

                chrome.storage.sync.set({"probs_list": problemList}, function(){
                    console.log("set data to storage.")
                });
            });
        }
    }, 100);
};

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        switch(message) {
            case "getProblemName":
                let problemName = getProblemName();
                sendResponse(problemName);
                break;
            default:
                console.error("Unrecognized message", message);
        }
    }
);

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
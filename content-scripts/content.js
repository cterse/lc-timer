
function getProblemName() {
    // return document.querySelector("div[data-cy=question-title]").innerText.split('.')[1].trim()
    return document.getElementsByTagName("title")[0].innerText;
}

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
function getProblemObject(init_timestamp) {
    problemTitleNode = document.querySelector("div[data-cy=question-title]");

    probObj = {code: null, name: null, init_ts: init_timestamp};

    if(!problemTitleNode){
        console.error("Error getting problem title node.");
    } else {
        probObj.code = problemTitleNode.innerText.split('.')[0].trim();
        probObj.name = problemTitleNode.innerText.split('.')[1].trim();
    }

    return probObj;
}

function getProblemName() {
    return document.getElementsByTagName("title")[0].innerText;
}

chrome.tabs.query({active: true, currentWindow: true}, 
    function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, "getProblemName", 
            function(response) {
                if(!response) {
                    console.error("response error: ", response);
                    return;
                }

                let problemsList = document.getElementById("main").innerHTML;
                problemsList = problemsList + " : " + response;
                document.getElementById("main").innerHTML = problemsList;
            }
        );
    }    
);
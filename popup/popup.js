chrome.storage.sync.get("problem_collection_obj", function(result){
    if(!result) {
        console.error("popup: Error retrieving result from storage.");
        return null;
    }

    if (result.problem_collection_obj) {
        // str = "Total problems monitored: " + result.problem_collection_obj.length + "<br/><br/>";
        setInterval(updatePopup, 1000);

        function updatePopup() {
            pstr = "";
            for (var key in result.problem_collection_obj) {
                if (result.problem_collection_obj.hasOwnProperty(key)) {
                    problemObj = result.problem_collection_obj[key];
                    pstr += problemObj.code + " : " + problemObj.name + " : ";
                    pstr += (((problemObj.end_ts ? problemObj.end_ts : Date.now()) - problemObj.init_ts)/1000) + "<br />";
                } 
            }
            document.getElementById("main").innerHTML = pstr;
        }
    } else {
        console.debug("lc-timer:popup: No problems found in storage. Maybe start a problem first?")
    }
});
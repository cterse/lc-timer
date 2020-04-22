chrome.storage.sync.get("problem_collection_obj", function(result){
    if (result && result.problem_collection_obj) {
        // str = "Total problems monitored: " + result.problem_collection_obj.length + "<br/><br/>";
        setInterval(updatePopup, 1000);

        function updatePopup() {
            pstr = "";
            for (var key in result.problem_collection_obj) {
                if (result.problem_collection_obj.hasOwnProperty(key)) {
                    pstr += result.problem_collection_obj[key].code + " : " + result.problem_collection_obj[key].name + " : ";
                    pstr += ((Date.now() - result.problem_collection_obj[key].init_ts)/1000) + "<br />";
                } 
            }
            document.getElementById("main").innerHTML = pstr;
        }
    } else {
        console.error("Error retrieving problems from storage.")
    }

    console.dir(result);
    console.dir(result.problem_collection_obj);
});
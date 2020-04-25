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
                    latestSessionStart = problemObj.sessions_list[problemObj.sessions_list.length-1].s_init_ts;
                    latestSessionEnd = problemObj.sessions_list[problemObj.sessions_list.length-1].s_end_ts;
                    latestSessionEnd = latestSessionEnd ? latestSessionEnd : Date.now();
                    timeElapsed = latestSessionEnd - latestSessionStart;

                    pstr += problemObj.code + " : " + problemObj.name + " : ";
                    pstr += getDaysFromTs(timeElapsed) ? getDaysFromTs(timeElapsed) + "d " : "";
                    pstr += getHoursFromTs(timeElapsed) ? getHoursFromTs(timeElapsed) + "h " : "";
                    pstr += getMinutesFromTs(timeElapsed) ? getMinutesFromTs(timeElapsed) + "m " : "";
                    pstr += getSecondsFromTs(timeElapsed) ? getSecondsFromTs(timeElapsed) + "s " : "0 s";
                    pstr += "<br />";
                }
            }
            document.getElementById("main").innerHTML = pstr;
        }
    } else {
        console.debug("lc-timer:popup: No problems found in storage. Maybe start a problem first?")
    }
});

function getSecondsFromTs(ts) {
    if (!ts) return null;

    return Math.floor((ts/1000) % 60);
}

function getMinutesFromTs(ts) {
    if (!ts) return null;

    return Math.floor(( (ts/1000) / 60 ) % 60 );
}

function getHoursFromTs(ts) {
    if (!ts) return null;

    return Math.floor( ((ts/1000) / (60 * 60)) % 24 );
}

function getDaysFromTs(ts) {
    if (!ts) return null;

    return Math.floor( (ts/1000) / (60 * 60 * 24) );
}
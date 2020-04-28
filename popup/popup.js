chrome.storage.sync.get([constants.STORAGE_PROBLEM_COLLECTION], function(result){
    if(!result) {
        console.error("popup: Error retrieving result from storage.");
        return null;
    }

    if (result.problem_collection_obj) {
        // str = "Total problems monitored: " + result.problem_collection_obj.length + "<br/><br/>";
        updatePopup();

        function updatePopup() {
            $('#main-container').empty();
            for (var key in result.problem_collection_obj) {
                if (result.problem_collection_obj.hasOwnProperty(key)) {
                    problemObj = result.problem_collection_obj[key];
                    problemCode = problemObj.code.toString();
                    
                    $('#main-container').append('<div class="row" id="problem-'+problemCode+'">');
                    $('#problem-'+problemCode).append('<div class="col-2-auto">'+problemCode+' -&nbsp;</div>');
                    $('#problem-'+problemCode).append('<div class="col-3-auto">'+problemObj.name+'</div>');
                    $('#problem-'+problemCode).append('<div class="col-3-auto ml-auto" id="problem-'+problemCode+'-timer"></div>');
                    $('#problem-'+problemCode).append('<div class="col-1-auto"><a data-toggle="collapse" href="#sessionsDiv-'+problemCode+'" role="button" aria-expanded="false" aria-controls="sessionsDiv-'+problemCode+'" data-placement="bottom" title="Previous Sessions"><svg class="bi bi-chevron-down" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z" clip-rule="evenodd"/></svg></a></div>');

                    setInterval(updateTimestampString, 1000);
                    function updateTimestampString() {
                        latestSessionStart = problemObj.sessions_list[problemObj.sessions_list.length-1].s_init_ts;
                        latestSessionEnd = problemObj.sessions_list[problemObj.sessions_list.length-1].s_end_ts;
                        latestSessionEnd = latestSessionEnd ? latestSessionEnd : Date.now();
                        timeElapsed = latestSessionEnd - latestSessionStart;

                        $('#problem-'+problemCode+'-timer').text(getTimerString(timeElapsed));
                    }

                    $('#main-container').append('<div class="collapse sessions-div" id="sessionsDiv-'+problemCode+'">');
                    for (var s_it=problemObj.sessions_list.length-1; s_it >= 0; s_it--) {   // s_it = session_iterator
                        let session = problemObj.sessions_list[s_it];
                        let sessionRowId = session.s_id.toString();
                        let sessionTime = session.s_end_ts ? getTimerString(session.s_end_ts - session.s_init_ts) : "Session Active";

                        $('#sessionsDiv-'+problemCode).append('<div class="row justify-content-end" id="'+sessionRowId+'">');
                        $('#'+sessionRowId).append('<div class="col-1-auto mr-2">Session: '+session.s_id+'</div>');
                        $('#'+sessionRowId).append('<div class="col-2-auto">'+sessionTime+'</div>');
                    }
                }
            }
        }
    } else {
        console.debug("lc-timer:popup: No problems found in storage. Maybe start a problem first?")
    }
});

function getTimerString(timeElapsed) {
    let str = "";
    str += getDaysFromTs(timeElapsed) ? getDaysFromTs(timeElapsed) + "d " : "";
    str += getHoursFromTs(timeElapsed) ? getHoursFromTs(timeElapsed) + "h " : "";
    str += getMinutesFromTs(timeElapsed) ? getMinutesFromTs(timeElapsed) + "m " : "";
    str += getSecondsFromTs(timeElapsed) ? getSecondsFromTs(timeElapsed) + "s " : "0 s";

    return str;
}

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
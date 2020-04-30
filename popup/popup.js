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
                    $('#problem-'+problemCode).append('<div class="col-1-auto">'+problemCode+' -&nbsp;</div>');

                    // Set problem name. Get a marquee if problem name is greater than enclosing col offsetWidth
                    $('#problem-'+problemCode).append('<div class="col-5" id="problem-'+problemCode+'-name"></div>');
                    if(marqueeNeeded(problemObj.name, $('#problem-'+problemCode+'-name'))) {
                        $('#problem-'+problemCode+'-name').append('<marquee direction="left">'+problemObj.name+'</marquee>');
                    } else {
                        $('#problem-'+problemCode+'-name').removeClass("col-5").addClass("col-5-auto").text(problemObj.name);
                    }

                    $('#problem-'+problemCode).append('<div class="col-4 ml-auto" id="problem-'+problemCode+'-timer"></div>');
                    $('#problem-'+problemCode).append('<div class="col-1-auto"><a data-toggle="collapse" href="#sessionsDiv-'+problemCode+'" role="button" aria-expanded="false" aria-controls="sessionsDiv-'+problemCode+'" data-placement="bottom" title="Previous Sessions"><svg class="bi bi-chevron-down" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z" clip-rule="evenodd"/></svg></a></div>');

                    (function(problem) {
                        setInterval(updateTimestampString, 1000);
                        function updateTimestampString() {
                            let latestSessionStart = problem.sessions_list[problem.sessions_list.length-1].s_init_ts;
                            let latestSessionEnd = problem.sessions_list[problem.sessions_list.length-1].s_end_ts;
                            latestSessionEnd = latestSessionEnd ? latestSessionEnd : Date.now();
                            // let timeElapsed = latestSessionEnd - latestSessionStart;
                            let timerString = getTimerString(latestSessionEnd - latestSessionStart);
                            
                            // Set problem timer string. Get a marquee if timer string is greater than enclosing col offsetWidth
                            // if(marqueeNeeded(timerString, $('#problem-'+problem.code+'-timer'))) {
                            //     $('#problem-'+problem.code+'-timer').append('<marquee direction="left">'+timerString+'</marquee>');
                            // } else {
                                $('#problem-'+problem.code+'-timer').removeClass("col-4").addClass("col-4-auto").text(timerString);
                            // }
                            
                        }
                    })(problemObj);
                    
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

function marqueeNeeded(text, parentElement) {
    $("#ruler").text(text);
    let retVal = $("#ruler").outerWidth() > parentElement.outerWidth();
    $("#ruler").text("");
    return retVal;
}
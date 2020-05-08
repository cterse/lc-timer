chrome.storage.sync.get([constants.STORAGE_PROBLEM_COLLECTION], function(result){
    if(!result) {
        console.error("popup: Error retrieving result from storage.");
        return null;
    }

    if (result.problem_collection_obj && !$.isEmptyObject(result.problem_collection_obj)) {
        $('#main-container').empty();
        
        let activeCompleteProblemsCountObj = getActiveCompleteProblemsCountObject(result.problem_collection_obj);
        $('#main-container').append('<div id="active-problems-div"></div>');
        $('#main-container').append('<div id="complete-problems-div"></div>');

        for (var key in result.problem_collection_obj) {
            if (!result.problem_collection_obj.hasOwnProperty(key)) continue;
            
            generateProblemRowHTML(result.problem_collection_obj[key]);
        }

        // Show total problems count at the end
        $('#active-problems-div').after('<div id="problem-count-div">');
        $('#problem-count-div').append('<div class="row">');
        $('#problem-count-div div.row').append('<div class="col-12" align="center"><p>Active Problems: '+activeCompleteProblemsCountObj.activeCount+'</p></div>');
        $('#problem-count-div div.row').append('<div class="col-12" align="center"><p>Completed Problems: '+activeCompleteProblemsCountObj.completeCount+'</p></div>');
        $('#problem-count-div').append('<div class="divider div-transparent div-dot"></div>'); // line separator
        
        // Links to clear problems
        $('#main-container').append('<div id="clear-problems-div" class="row">');
        $('#clear-problems-div').append('<div class="col text-center">');
        if (activeCompleteProblemsCountObj.activeCount > 0) $('#clear-problems-div div').append('<a id="clear-active-link" href="#">Clear Active</a>');
        if (activeCompleteProblemsCountObj.completeCount > 0) $('#clear-problems-div div').append('<a id="clear-complete-link" href="#">Clear Complete</a>');
        $('#clear-active-link').click(function() {
            purgeProblemSessionsFromStorageHavingStatus(constants.PROBLEM_STATUS_ACTIVE);
        });
        $('#clear-complete-link').click(function() {
            purgeProblemSessionsFromStorageHavingStatus(constants.PROBLEM_STATUS_COMPLETE);
        });

    } else {
        console.debug("lc-timer:popup: No problems found in storage. Maybe start a problem first?")
    }
});

/*
    Function used to generate problem row HTML for active and complete sections.
*/
function generateProblemRowHTML(problem) {
    if (!problem) return null;

    let sectionDivId = null;
    if(isProblemActive(problem)) sectionDivId = "active-problems-div";
    else if (isProblemComplete(problem)) sectionDivId = "complete-problems-div";
    if (!sectionDivId) return null;

    let problemCode = problem.code.toString();

    $('#'+sectionDivId+'').append('<div class="row" id="problem-'+problemCode+'">');
    
    // Problem code
    $('#problem-'+problemCode).append('<div class="col-1-auto"><a target="_blank" href="'+problem.url+'" data-placement="bottom" title="Go To Problem">'+problemCode+'</a> -&nbsp;</div>');

    // Set problem name. Get a marquee if problem name is greater than enclosing col offsetWidth
    $('#problem-'+problemCode).append('<div class="col-5" id="problem-'+problemCode+'-name"></div>');
    if(marqueeNeeded(problem.name, $('#problem-'+problemCode+'-name'))) {
        $('#problem-'+problemCode+'-name').append('<marquee scrolldelay="200" direction="left">'+problem.name+'</marquee>');
    } else {
        $('#problem-'+problemCode+'-name').removeClass("col-5").addClass("col-5-auto").text(problem.name);
    }

    //Timer string div
    $('#problem-'+problemCode).append('<div class="col-4-auto ml-auto" id="problem-'+problemCode+'-timer"><a data-toggle="collapse" href="#sessionsDiv-'+problemCode+'" role="button" aria-expanded="false" aria-controls="sessionsDiv-'+problemCode+'" data-placement="bottom" title="Session Info"></a></div>');
    let latestSessionStart = problem.sessions_list[problem.sessions_list.length-1].s_init_ts;
    let latestSessionEnd = problem.sessions_list[problem.sessions_list.length-1].s_end_ts;
    if (isProblemComplete(problem)) $('#problem-'+problem.code+'-timer a').text(getTimerString(latestSessionEnd - latestSessionStart));
    else {
        // Generate timer string for active problems
        (function(problem) {
            setInterval(updateTimestampString, 1000);
            function updateTimestampString() {
                latestSessionStart = problem.sessions_list[problem.sessions_list.length-1].s_init_ts;
                latestSessionEnd = Date.now();
                let timerString = getTimerString(latestSessionEnd - latestSessionStart);
                
                $('#problem-'+problem.code+'-timer a').text(timerString);
            }
        })(problem);
    }
    
    // Display session information
    $('#'+sectionDivId+'').append('<div class="collapse sessions-div" id="sessionsDiv-'+problemCode+'">');
    for (var s_it=problem.sessions_list.length-1; s_it >= 0; s_it--) {   // s_it = session_iterator
        let session = problem.sessions_list[s_it];
        let sessionRowId = session.s_id.toString();
        let sessionTime = session.s_end_ts ? getTimerString(session.s_end_ts - session.s_init_ts) : "Session Active";

        $('#sessionsDiv-'+problemCode).append('<div class="row justify-content-end" id="'+sessionRowId+'">');
        $('#'+sessionRowId).append('<div class="col-1-auto mr-2">Session: '+session.s_id+'</div>');
        $('#'+sessionRowId).append('<div class="col-2-auto">'+sessionTime+'</div>');
    }

    // Add line separator, prepend if problem complete
    $('#'+sectionDivId+'').append('<div class="divider div-transparent div-dot"></div>');
}

function getTimerString(timeElapsed) {
    let str = "";
    str += getDaysFromTs(timeElapsed) ? getDaysFromTs(timeElapsed) + "d " : "";
    str += getHoursFromTs(timeElapsed) ? getHoursFromTs(timeElapsed) + "h " : "";
    str += getMinutesFromTs(timeElapsed) ? getMinutesFromTs(timeElapsed) + "m " : "";
    str += getSecondsFromTs(timeElapsed) ? getSecondsFromTs(timeElapsed) + "s " : "0s";

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
    $("body").append('<span id="ruler" style="visibility: hidden; white-space: nowrap;"></span>');
    $("#ruler").text(text);
    let retVal = $("#ruler").outerWidth() > parentElement.outerWidth();
    $("#ruler").remove();
    return retVal;
}

function purgeProblemSessionsFromStorageHavingStatus(status) {
    if (!status || (status != constants.PROBLEM_STATUS_ACTIVE && status != constants.PROBLEM_STATUS_COMPLETE)) {
        console.debug("lc-timer:popup:purgeProblemSessionsFromStorageHavingStatus : Faulty argument.");
        return null;
    }

    chrome.storage.sync.get([constants.STORAGE_PROBLEM_COLLECTION], function(result) {
        if(!result) {
            console.debug('Error retrieving results from storage.');
            return null;
        }

        problemCollection = result.problem_collection_obj;
        for (var key in problemCollection) {
            if (!problemCollection.hasOwnProperty(key)) continue;
            
            let problem = problemCollection[key];

            if (problem && problem.sessions_list && problem.sessions_list.length > 0) {
                for (var i=0; i<problem.sessions_list.length; i++) {
                    let session = problem.sessions_list[i];
                    if (!session) continue;

                    if ( (status === constants.SESSION_STATUS_ACTIVE && session.s_status === constants.SESSION_STATUS_ACTIVE) ||
                    (status === constants.SESSION_STATUS_COMPLETE && session.s_status === constants.SESSION_STATUS_COMPLETE) ) {
                        problem.sessions_list.splice(i, 1);
                    }
                }

                problemCollection = cleanupProblemCollectionObject(problemCollection);
            }
        }

        chrome.storage.sync.set({[constants.STORAGE_PROBLEM_COLLECTION]:  problemCollection}, function(){
            console.debug("lc-timer:popup: removed completed problems and updated storage.");
            location.reload();
        });
    });
}

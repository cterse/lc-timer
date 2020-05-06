const constants = {
    STORAGE_PROBLEM_COLLECTION: "problem_collection_obj",
    PROBLEM_TITLE_SELECTOR: "div[data-cy=question-title]",
    SUBMIT_BUTTON_SELECTOR: "button[data-cy=submit-code-btn]",
    SUBMISSION_SUCCESS_DIV_CLASS_SELECTOR: ".success__3Ai7",
    PROBLEM_STATUS_ACTIVE: "active",
    PROBLEM_STATUS_COMPLETE: "complete",
    SESSION_STATUS_ACTIVE: "active",
    SESSION_STATUS_COMPLETE: "complete",
};

function createProblemObject(init_timestamp) {
    probObj = {code: null, name: null, status: null, url: null, sessions_list: []};

    if ($( constants.PROBLEM_TITLE_SELECTOR ).length){
        probObj.code = extractProblemCode();
        probObj.name = extractProblemName();
        probObj.url = extractProblemUrl();
        probObj = startNewSessionForProblem(probObj, init_timestamp); // also updates the problem status 
    } else {
        console.error("lc-timer:problem_utils: Error getting problem title node.");
    }

    return probObj;
}

function startNewSessionForProblem(problem, init_ts) {
    let newSession = init_ts ? createNewSession(problem, init_ts) : createNewSession(problem, Date.now());
    problem.sessions_list.push(newSession);
    problem = setProblemStatus(problem, newSession.s_status);

    return problem;
}

function createNewSession(problem, init_timestamp) {
    let session = {s_id: null, s_init_ts: null, s_status: null, s_end_ts: null};

    session.s_id = problem.code + "-" + (problem.sessions_list.length+1);
    session.s_init_ts = init_timestamp ? init_timestamp : Date.now();
    session.s_status = constants.SESSION_STATUS_ACTIVE;

    return session;
}

function getProblemStatus(problem) {
    return problem.status;
}

function setProblemStatus(problem, status) {
    if (!problem) {
        console.error("lc-timer:problem_utils.setproblemStatus : faulty arguments");
    }
    problem.status = status;
    return problem; 
}

function getActualProblemStatus(problem) {
    if (!problem) {
        console.error("lc-timer:problem_utils.setproblemStatus : faulty arguments");
        return null;
    }
    if (!problem.sessions_list || !problem.sessions_list.length) {
        console.error("lc-timer:problem_utils.setproblemStatus : No session associated to problem: " + problem.code);
        return null;
    }
    return problem.sessions_list[problem.sessions_list.length-1].session_status;
}

function isProblemActive(problem) {
    return getProblemStatus(problem) == constants.PROBLEM_STATUS_ACTIVE;
}

function isProblemComplete(problem) {
    return getProblemStatus(problem) == constants.PROBLEM_STATUS_COMPLETE;
}

function extractProblemCode() {
    return $( constants.PROBLEM_TITLE_SELECTOR ).text().split('.')[0].trim();
}

function extractProblemName() {
    return $( constants.PROBLEM_TITLE_SELECTOR ).text().split('.')[1].trim();
}

function extractProblemUrl() {
    return location.href;
}

function completeActiveProblem(problem) {
    if (!problem || isProblemComplete(problem)) {
        console.debug("lc-timer:problem_utils.completeActiveProblem : Faulty arguemnt");
        return null;
    }

    let latestProblemSession = problem.sessions_list[problem.sessions_list.length-1];
    latestProblemSession.s_end_ts = Date.now();
    latestProblemSession.s_status = constants.SESSION_STATUS_COMPLETE;

    problem = setProblemStatus(problem, latestProblemSession.s_status);

    return problem;
}

function getActiveCompleteProblemsCountObject(problemCollectionObj) {
    if (!problemCollectionObj) return 0;

    let activeCount = 0, completeCount = 0;
    for (var key in problemCollectionObj) {
        if (problemCollectionObj.hasOwnProperty(key)) {
            if (problemCollectionObj[key]) {
                if (isProblemActive(problemCollectionObj[key])) activeCount++;
                if (isProblemComplete(problemCollectionObj[key])) completeCount++;
            }
        }
    }

    return {"activeCount": activeCount, "completeCount": completeCount};
}
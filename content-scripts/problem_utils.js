let PROBLEM_TITLE_SELECTOR = "div[data-cy=question-title]";
let PROBLEM_STATUS_ACTIVE = "active";
let PROBLEM_STATUS_COMPLETE = "complete";
let SESSION_STATUS_ACTIVE = PROBLEM_STATUS_ACTIVE;
let SESSION_STATUS_COMPLETE = PROBLEM_STATUS_COMPLETE;

function createProblemObject(init_timestamp) {
    probObj = {code: null, name: null, status: null, sessions_list: []};

    if ($( PROBLEM_TITLE_SELECTOR ).length){
        probObj.code = extractProblemCode();
        probObj.name = extractProblemName();
        probObj = startNewSessionForProblem(probObj); // also updates the problem status 
    } else {
        console.error("lc-timer:problem_utils: Error getting problem title node.");
    }

    return probObj;
}

function startNewSessionForProblem(problem) {
    let newSession = createNewSession(problem, Date.now());
    problem.sessions_list.push(newSession);
    problem = setProblemStatus(problem, newSession.s_status);

    return problem;
}

function createNewSession(problem, init_timestamp) {
    let session = {s_id: null, s_init_ts: null, s_status: null, s_end_ts: null};

    session.s_id = problem.code + "-" + (problem.sessions_list.length+1);
    session.s_init_ts = init_timestamp ? init_timestamp : Date.now();
    session.s_status = SESSION_STATUS_ACTIVE;

    return session;
}

function getProblemStatus(problem) {
    return problem.status;
}

function setProblemStatus(problem, status) {
    if (!problem) {
        console.debug("lc-timer:problem_utils.setproblemStatus : faulty arguments");
    }
    problem.status = status;
    return problem; 
}

function isProblemActive(problem) {
    return getProblemStatus(problem) == PROBLEM_STATUS_ACTIVE;
}

function isProblemComplete(problem) {
    return getProblemStatus(problem) == PROBLEM_STATUS_COMPLETE;
}

function extractProblemCode() {
    return $( PROBLEM_TITLE_SELECTOR ).text().split('.')[0].trim();
}

function extractProblemName() {
    return $( PROBLEM_TITLE_SELECTOR ).text().split('.')[1].trim();
}

function completeActiveProblem(problem) {
    if (!problem || isProblemComplete(problem)) {
        console.debug("lc-timer:problem_utils.completeActiveProblem : Faulty arguemnt");
        return null;
    }

    let latestProblemSession = problem.sessions_list[problem.sessions_list.length-1];
    latestProblemSession.s_end_ts = Date.now();
    latestProblemSession.s_status = SESSION_STATUS_COMPLETE;

    problem = setProblemStatus(problem, latestProblemSession.s_status);

    return problem;
}
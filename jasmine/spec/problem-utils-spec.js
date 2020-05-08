describe("problem-utils.js Test Suite", () => {

    beforeEach(() => {
        activeProblem = {
            "code":"1",
            "name":"Two Sum",
            "sessions_list":[
                {
                    "s_end_ts":1588788395999,
                    "s_id":"1-1",
                    "s_init_ts":1588788395463,
                    "s_status":"complete"
                },
                {
                    "s_end_ts":null,
                    "s_id":"1-2",
                    "s_init_ts":1588788396000,
                    "s_status":"active"
                }
            ],
            "url":"https://leetcode.com/problems/two-sum/"
        };

        completeProblem = {
            "code":"2",
            "name":"Add Two Numbers",
            "sessions_list":[
                {
                    "s_end_ts":1588788395999,
                    "s_id":"1-1",
                    "s_init_ts":1588788395463,
                    "s_status":"complete"
                },
                {
                    "s_end_ts":1588788397000,
                    "s_id":"1-2",
                    "s_init_ts":1588788396000,
                    "s_status":"complete"
                }
            ],
            "url":"https://leetcode.com/problems/add-two-numbers/"
        };

        noSessionProblem = {
            "code":"3",
            "name":"No Session Problem",
            "sessions_list":[],
            "url":"https://www.google.com"
        };
    });

    describe('get the problem status', () => {
        it("gets the problem status of an active problem", () => {
            let status = getProblemStatus(activeProblem);
            expect(status).toBe(constants.PROBLEM_STATUS_ACTIVE);
        });
    
        it("gets the problem status of a complete problem", () => {
            let status = getProblemStatus(completeProblem);
            expect(status).toBe(constants.PROBLEM_STATUS_COMPLETE);
        });
    
        it("gets problem status of a problem that has no sessions", () => {
            let status = getProblemStatus(noSessionProblem);
            expect(status).toBeNull();
        });

        it('gets problem status of a null/undefined problem', () => {
            let status = getProblemStatus();
            expect(status).toBeNull();
            status = getProblemStatus(null);
            expect(status).toBeNull();
        });
    });

    describe('check if a problem is complete', () => {
        it("checks if a given problem is complete", () => {
            let res = isProblemComplete(completeProblem);
            expect(res).toBeTrue();
            res = isProblemComplete(activeProblem);
            expect(res).toBeFalse();
            res = isProblemComplete(noSessionProblem);
            expect(res).toBeFalse();
        });

        it('checks if problem is active when problem provided is null/undefined', () => {
            let res = isProblemComplete();
            expect(res).toBeFalse();
            res = isProblemComplete(null);
            expect(res).toBeFalse();
        });
    });

    describe('check if problem is active', () => {
        it("checks if given problem is active", () => {
            let res = isProblemActive(activeProblem);
            expect(res).toBeTrue();
            res = isProblemActive(completeProblem);
            expect(res).toBeFalse();
            res = isProblemActive(noSessionProblem);
            expect(res).toBeFalse();
        });

        it('checks if problem is active when problem provided is null/undefined', () => {
            let res = isProblemActive();
            expect(res).toBeFalse();
            res = isProblemActive(null);
            expect(res).toBeFalse();
        });
    });

    describe('start a new session for a problem', () => {
        it("starts a new session for a problem with a provided timestamp", () => {
            let init_ts = Date.now();
            let fakeSession = {s_id: '1', s_status: 'fake_session'};
            spyOn(window, "createNewSession").and.returnValue(fakeSession);
            
            let ret = startNewSessionForProblem(completeProblem, init_ts);
            
            expect(ret).not.toBeNull();
            expect(createNewSession).toHaveBeenCalledWith(completeProblem, init_ts);
            expect(completeProblem.sessions_list[completeProblem.sessions_list.length-1]).toBe(fakeSession);
        });

        it("starts a new session for a problem with no timestamp", () => {
            let fakeSession = {s_id: '1', s_status: 'fake_session'};
            spyOn(window, "createNewSession").and.returnValue(fakeSession);
            
            let ret = startNewSessionForProblem(completeProblem);

            expect(ret).not.toBeNull();
            expect(createNewSession).toHaveBeenCalledWith(completeProblem, jasmine.any(Number));
            expect(completeProblem.sessions_list[completeProblem.sessions_list.length-1]).toBe(fakeSession);
        });

        it("tries to start a new session for a undefined/null problem", () => {
            let ret = startNewSessionForProblem(null, Date.now());
            expect(ret).toBeNull();
            ret = startNewSessionForProblem(undefined, Date.now());
            expect(ret).toBeNull();
        });
    });

    describe('create a session object', () => {
        it('creates a session object given a problem object and a timestamp', () => {
            let ts = Date.now();
            let session = createNewSession(completeProblem, ts);

            expect(session.s_id).toMatch(new RegExp(completeProblem.code + '-[0-9]+'));
            expect(session.s_init_ts).toBe(ts);
            expect(session.s_status).toBe(constants.SESSION_STATUS_ACTIVE);
            expect(session.s_end_ts).toBeNull();
        });

        it('creates a session object given a problem object but no timestamp', () => {
            let session = createNewSession(completeProblem);

            expect(session.s_id).toMatch(new RegExp(completeProblem.code + '-[0-9]+'));
            expect(session.s_init_ts).toEqual(jasmine.any(Number));
            expect(session.s_status).toBe(constants.SESSION_STATUS_ACTIVE);
            expect(session.s_end_ts).toBeNull();
        });

        it('creates a session object given a timestamp but no problem object', () => {
            let ret = createNewSession();
            expect(ret).toBeNull();
        });

        it('creates a session object given a no parameters', () => {
            let ret = createNewSession();
            expect(ret).toBeNull();
        });
    });

    describe('complete an active problem', () => {
        it('completes an active problem', () => {
            let ret = completeActiveProblem(activeProblem);

            expect(ret.code).toBe(activeProblem.code);
            expect(ret.name).toBe(activeProblem.name);
            expect(ret.url).toBe(activeProblem.url);
            expect(ret.sessions_list.length).toBe(activeProblem.sessions_list.length);
            expect(ret.sessions_list[ret.sessions_list.length-1].s_id).toBe(activeProblem.sessions_list[activeProblem.sessions_list.length-1].s_id);
            expect(ret.sessions_list[ret.sessions_list.length-1].s_status).toBe(constants.SESSION_STATUS_COMPLETE);
            expect(ret.sessions_list[ret.sessions_list.length-1].s_end_ts).not.toBeNull();
        });
        
        it('completes an already complete problem', () => {
            let ret = completeActiveProblem(completeProblem);
            
            expect(ret).toBe(completeProblem);
        });
        
        it('completes an undefined/null problem', () => {
            let ret = completeActiveProblem();
            expect(ret).toBeNull();
            ret = completeActiveProblem(null);
            expect(ret).toBeNull();
        });

        it('completes a problem that has no sessions', () => {
            ret = completeActiveProblem(noSessionProblem);
            expect(ret).toBeNull();
        });
    });

    describe('get (active,complete) count object from problem collection object', () => {
        it('gets count when the problem collection is empty/null/undefined', () => {
            let countObj = getActiveCompleteProblemsCountObject();
            expect(countObj.activeCount).toBe(0);
            expect(countObj.completeCount).toBe(0);

            countObj = getActiveCompleteProblemsCountObject(null);
            expect(countObj.activeCount).toBe(0);
            expect(countObj.completeCount).toBe(0);

            countObj = getActiveCompleteProblemsCountObject({});
            expect(countObj.activeCount).toBe(0);
            expect(countObj.completeCount).toBe(0);
        });

        it('gets count given a collection of only problems having no sessions', () => {
            let problemCollectionObj = {};
            problemCollectionObj[noSessionProblem.code] = noSessionProblem;

            let countObj = getActiveCompleteProblemsCountObject(problemCollectionObj);
            expect(countObj.activeCount).toBe(0);
            expect(countObj.completeCount).toBe(0);
        });

        it('gets count given a collection is of mixed problem types', () => {
            let problemCollectionObj = {};
            problemCollectionObj[noSessionProblem.code] = noSessionProblem;
            problemCollectionObj[activeProblem.code] = activeProblem;
            problemCollectionObj[completeProblem.code] = completeProblem;

            let countObj = getActiveCompleteProblemsCountObject(problemCollectionObj);
            expect(countObj.activeCount).toBe(1);
            expect(countObj.completeCount).toBe(1);
        });
    });
});
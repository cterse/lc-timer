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
        it("of an active problem", () => {
            let status = getProblemStatus(activeProblem);
            expect(status).toBe(constants.PROBLEM_STATUS_ACTIVE);
        });
    
        it("of a complete problem", () => {
            let status = getProblemStatus(completeProblem);
            expect(status).toBe(constants.PROBLEM_STATUS_COMPLETE);
        });
    
        it("of a problem that has no sessions", () => {
            let status = getProblemStatus(noSessionProblem);
            expect(status).toBeNull();
        });

        it('of a null/undefined problem', () => {
            let status = getProblemStatus();
            expect(status).toBeNull();
            status = getProblemStatus(null);
            expect(status).toBeNull();
        });
    });

    describe('check if a problem is complete', () => {
        it("given a complete problem", () => {
            let res = isProblemComplete(completeProblem);
            expect(res).toBeTrue();
            res = isProblemComplete(activeProblem);
            expect(res).toBeFalse();
            res = isProblemComplete(noSessionProblem);
            expect(res).toBeFalse();
        });

        it('given a null/undefined problem', () => {
            let res = isProblemComplete();
            expect(res).toBeFalse();
            res = isProblemComplete(null);
            expect(res).toBeFalse();
        });
    });

    describe('check if problem is active', () => {
        it("given an active problem", () => {
            let res = isProblemActive(activeProblem);
            expect(res).toBeTrue();
            res = isProblemActive(completeProblem);
            expect(res).toBeFalse();
            res = isProblemActive(noSessionProblem);
            expect(res).toBeFalse();
        });

        it('given a null/undefined problem', () => {
            let res = isProblemActive();
            expect(res).toBeFalse();
            res = isProblemActive(null);
            expect(res).toBeFalse();
        });
    });

    describe('start a new session for a problem', () => {
        it("given a problem and a timestamp", () => {
            let init_ts = Date.now();
            let fakeSession = {s_id: '1', s_status: 'fake_session'};
            spyOn(window, "createNewSession").and.returnValue(fakeSession);
            
            let ret = startNewSessionForProblem(completeProblem, init_ts);
            
            expect(ret).not.toBeNull();
            expect(createNewSession).toHaveBeenCalledWith(completeProblem, init_ts);
            expect(completeProblem.sessions_list[completeProblem.sessions_list.length-1]).toBe(fakeSession);
        });

        it("given a problem with no timestamp", () => {
            let fakeSession = {s_id: '1', s_status: 'fake_session'};
            spyOn(window, "createNewSession").and.returnValue(fakeSession);
            
            let ret = startNewSessionForProblem(completeProblem);

            expect(ret).not.toBeNull();
            expect(createNewSession).toHaveBeenCalledWith(completeProblem, jasmine.any(Number));
            expect(completeProblem.sessions_list[completeProblem.sessions_list.length-1]).toBe(fakeSession);
        });

        it("for an undefined/null problem", () => {
            let ret = startNewSessionForProblem(null, Date.now());
            expect(ret).toBeNull();
            ret = startNewSessionForProblem(undefined, Date.now());
            expect(ret).toBeNull();
        });
    });

    describe('create a session object', () => {
        it('given a problem object and a timestamp', () => {
            let ts = Date.now();
            let session = createNewSession(completeProblem, ts);

            expect(session.s_id).toMatch(new RegExp(completeProblem.code + '-[0-9]+'));
            expect(session.s_init_ts).toBe(ts);
            expect(session.s_status).toBe(constants.SESSION_STATUS_ACTIVE);
            expect(session.s_end_ts).toBeNull();
        });

        it('given a problem object but no timestamp', () => {
            let session = createNewSession(completeProblem);

            expect(session.s_id).toMatch(new RegExp(completeProblem.code + '-[0-9]+'));
            expect(session.s_init_ts).toEqual(jasmine.any(Number));
            expect(session.s_status).toBe(constants.SESSION_STATUS_ACTIVE);
            expect(session.s_end_ts).toBeNull();
        });

        it('given a timestamp but no problem object', () => {
            let ret = createNewSession();
            expect(ret).toBeNull();
        });

        it('given no parameters', () => {
            let ret = createNewSession();
            expect(ret).toBeNull();
        });
    });

    describe('complete an active problem', () => {
        it('given an active problem', () => {
            let ret = completeActiveProblem(activeProblem);

            expect(ret.code).toBe(activeProblem.code);
            expect(ret.name).toBe(activeProblem.name);
            expect(ret.url).toBe(activeProblem.url);
            expect(ret.sessions_list.length).toBe(activeProblem.sessions_list.length);
            expect(ret.sessions_list[ret.sessions_list.length-1].s_id).toBe(activeProblem.sessions_list[activeProblem.sessions_list.length-1].s_id);
            expect(ret.sessions_list[ret.sessions_list.length-1].s_status).toBe(constants.SESSION_STATUS_COMPLETE);
            expect(ret.sessions_list[ret.sessions_list.length-1].s_end_ts).not.toBeNull();
        });
        
        it('given an already complete problem', () => {
            let ret = completeActiveProblem(completeProblem);
            
            expect(ret).toBe(completeProblem);
        });
        
        it('given an undefined/null problem', () => {
            let ret = completeActiveProblem();
            expect(ret).toBeNull();
            ret = completeActiveProblem(null);
            expect(ret).toBeNull();
        });

        it('given a problem that has no sessions', () => {
            ret = completeActiveProblem(noSessionProblem);
            expect(ret).toBeNull();
        });
    });

    describe('get (active,complete) count object from problem collection object', () => {
        it('when the problem collection is empty/null/undefined', () => {
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

        it('when the collection of only problems having no sessions', () => {
            let problemCollectionObj = {};
            problemCollectionObj[noSessionProblem.code] = noSessionProblem;

            let countObj = getActiveCompleteProblemsCountObject(problemCollectionObj);
            expect(countObj.activeCount).toBe(0);
            expect(countObj.completeCount).toBe(0);
        });

        it('given a collection of mixed problem types', () => {
            let problemCollectionObj = {};
            problemCollectionObj[noSessionProblem.code] = noSessionProblem;
            problemCollectionObj[activeProblem.code] = activeProblem;
            problemCollectionObj[completeProblem.code] = completeProblem;

            let countObj = getActiveCompleteProblemsCountObject(problemCollectionObj);
            expect(countObj.activeCount).toBe(1);
            expect(countObj.completeCount).toBe(1);
        });
    });

    it('extract problem name from DOM', () => {
        let html = '<div data-cy="question-title" class="css-v3d350">1. Two Sum</div>';
        let test = $(html + ' ' + constants.PROBLEM_TITLE_SELECTOR);
        spyOn(window, '$').and.returnValue(test);

        let ret = extractProblemName();
        
        expect(ret).toBe("Two Sum");
    });

    it('extract problem code from DOM', () => {
        let html = '<div data-cy="question-title" class="css-v3d350">1. Two Sum</div>';
        let test = $(html + ' ' + constants.PROBLEM_TITLE_SELECTOR);
        spyOn(window, '$').and.returnValue(test);

        let ret = extractProblemCode();
        
        expect(ret).toBe("1");
    });

    it('extract problem code', () => {
        let ret = extractProblemUrl();

        expect(ret).toBe(location.href);
    });

    describe('cleanup problem collection object', () => {
        it('given the collection object has no problems with undefined/null/empty session_list array', () => {
            let collectionObj = {};
            collectionObj[activeProblem.code] = activeProblem;
            collectionObj[completeProblem.code] = completeProblem;

            let cleanCollectionObj = cleanupProblemCollectionObject(collectionObj);

            expect(cleanCollectionObj).toBe(collectionObj);
        });

        it('given the collection object has problems with undefined/null/empty session_list array', () => {
            let collectionObj = {};
            collectionObj[activeProblem.code] = activeProblem;
            collectionObj[completeProblem.code] = completeProblem;
            collectionObj[noSessionProblem.code] = noSessionProblem;
            let cleanCollectionObj = {};
            cleanCollectionObj[activeProblem.code] = activeProblem;
            cleanCollectionObj[completeProblem.code] = completeProblem;

            let cleanedCollectionObj = cleanupProblemCollectionObject(collectionObj);

            expect(cleanedCollectionObj).toEqual(cleanCollectionObj);
        });

        it('given an empty/null/undefined collection object', () => {
            let cleanCollectionObj = cleanupProblemCollectionObject();
            expect(cleanCollectionObj).toBeNull();

            cleanCollectionObj = cleanupProblemCollectionObject(null);
            expect(cleanCollectionObj).toBeNull();

            cleanCollectionObj = cleanupProblemCollectionObject({});
            expect(cleanCollectionObj).toEqual({});
        });
    });
});
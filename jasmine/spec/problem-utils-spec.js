describe("problem-utils.js Test Suite", () => {

    beforeAll(() => {
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

        problemCollectionObject = {
            "1": activeProblem,
            "2": completeProblem,
            "3": noSessionProblem
        };
    });

    it("returns the problem status of an active problem", () => {
        let status = getProblemStatus(activeProblem);
        expect(status).toBe(constants.PROBLEM_STATUS_ACTIVE);
    });

    it("returns the problem status of a complete problem", () => {
        let status = getProblemStatus(completeProblem);
        expect(status).toBe(constants.PROBLEM_STATUS_COMPLETE);
    });

    it("returns problem status of a problem that has no sessions", () => {
        let status = getProblemStatus(noSessionProblem);
        expect(status).toBeNull();
    });

    it("checks if problem is complete", () => {
        let res = isProblemComplete(completeProblem);
        expect(res).toBe(true);
        res = isProblemComplete(activeProblem);
        expect(res).toBe(false);
        res = isProblemComplete(noSessionProblem);
        expect(res).toBe(false);
    });

    it("checks if problem is active", () => {
        let res = isProblemActive(activeProblem);
        expect(res).toBe(true);
        res = isProblemActive(completeProblem);
        expect(res).toBe(false);
        res = isProblemActive(noSessionProblem);
        expect(res).toBe(false);
    });

});
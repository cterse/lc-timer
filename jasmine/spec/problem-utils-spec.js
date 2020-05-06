describe("problem-utils.js Test Suite", () => {

    beforeAll(() => {
        problem = {
            "code":"1",
            "name":"Two Sum",
            "sessions_list":[
                {
                    "s_end_ts":null,
                    "s_id":"1-1",
                    "s_init_ts":1588788395463,
                    "s_end_ts":1588788395999,
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

        problemCollectionObject = {
            "1": problem
        };
    });

    it("returns the problem status", () => {
        let status = getProblemStatus(problem);

        expect(status).toBe(constants.PROBLEM_STATUS_ACTIVE);
    });
});
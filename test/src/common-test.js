/********************************************************************************/
/* pklib.common TestCase */
/********************************************************************************/

buster.testCase("pklib.common", {
    "assert": function () {
        try {
            pklib.common.assert(true);
            pklib.common.assert(1 == '1');
            pklib.common.assert(1 === 1);
            assert("Check every true value");
        } catch (e) {

        }
    },

    "defer": function () {
        var a = 1;
        pklib.common.defer(function () {
            a = 2;
        });
        assert.equals(a, 1, "Defer run in separate thread function");
    },

    "checking": function () {
        var a = 0;
        pklib.common.checking(function () {
            return true;
        }, function () {
            a = 1;
        });
        assert.equals(a, 1, "Checking with static return 'true'");

        pklib.common.checking(function () {
            return false;
        }, function () {
            a = 2;
        });
        assert.equals(a, 1, "Checking with static return 'false'");
    }
});

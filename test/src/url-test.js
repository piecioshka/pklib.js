/********************************************************************************/
/* pklib.url TestCase */
/********************************************************************************/

buster.testCase("pklib.url", {
    "get_params": function () {
        var params = pklib.url.get_params();
        assert.equals(typeof params, "object", "Params always object");
    },

    "get_param": function () {
        var undefined_param = pklib.url.get_param("undefined");
        assert.equals(undefined_param, null, "Undefined param");
    }
});

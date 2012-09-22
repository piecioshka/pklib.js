/********************************************************************************/
/* pklib.browser TestCase */
/********************************************************************************/

buster.testCase("pklib.browser", {
    "get_name": function () {
        var name = pklib.browser.get_name();
        assert(name, "Browser name: " + name);
        assert(pklib.string.is_string(name), "Browser name is string");
    },

    "get_version": function () {
        var version = pklib.browser.get_version();
        assert(version, "Browser version: " + version);
        assert(pklib.string.is_string(version), "Browser version is string");
    }
});

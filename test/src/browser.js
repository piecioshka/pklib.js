window.addEventListener("load", function () {
    
    module("pklib.browser");

    // pklib.browser.getName
    test("getName", function() {

        var name = pklib.browser.getName();
        ok(name, "Browser name: " + name);
        ok(pklib.string.isString(name), "Browser name is string");
    });

    // pklib.browser.getVersion
    test("getVersion", function() {

        var version = pklib.browser.getVersion();
        ok(version, "Browser version: " + version);
        ok(pklib.string.isString(version), "Browser version is string");
    });

});

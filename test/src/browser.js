(function (global) {
    "use strict";

    pklib.event.add(global, "load", function () {
        module("pklib.browser");

        test("get_name", function () {
            var name = pklib.browser.get_name();
            ok(name, "Browser name: " + name);
            ok(pklib.string.is_string(name), "Browser name is string");
        });
        test("get_version", function () {
            var version = pklib.browser.get_version();
            ok(version, "Browser version: " + version);
            ok(pklib.string.is_string(version), "Browser version is string");
        });
    });

}(this));

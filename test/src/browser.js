(function (global) {
    "use strict";

    var pklib = global.pklib;

    pklib.event.add(window, "load", function () {

        module("pklib.browser");

        test("getName", function() {
            var name = pklib.browser.getName();
            ok(name, "Browser name: " + name);
            ok(pklib.string.isString(name), "Browser name is string");
        });
        test("getVersion", function() {
            var version = pklib.browser.getVersion();
            ok(version, "Browser version: " + version);
            ok(pklib.string.isString(version), "Browser version is string");
        });
    });
}(this));

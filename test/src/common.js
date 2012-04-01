(function (global) {
    "use strict";

    var pklib = global.pklib;

    pklib.event.add(window, "load", function () {

        module("pklib.common");

        test("assert", function() {
            strictEqual(pklib.common.assert(true, true), true, "Check every true value");
        });
        test("defer", function() {
            var a = 1;
            pklib.common.defer(function () {
                a = 2;
            });
            strictEqual(a, 1, "Defer run in separate thread function");
        });
    });
}(this));

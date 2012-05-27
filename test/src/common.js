(function (global) {
    "use strict";
    var pklib = global.pklib;

    pklib.event.add(global, "load", function () {
        module("pklib.common");

        test("assert", function() {
            try {
                pklib.common.assert(true);
                pklib.common.assert(1 == '1');
                pklib.common.assert(1 === 1);
                ok("Check every true value");
            } catch (e) {

            }
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

(function (global) {
    "use strict";

    var pklib = global.pklib;

    pklib.event.add(window, "load", function () {

        module("pklib");

        function test_aspect () {
            var x = "";
            this.a = function () {
                x += "a";
            };
            this.b = function () {
                x += "b";
            };
            this.get = function () {
                return x;
            };
        }
        test("aspect", function () {
            var test = new test_aspect();
            test.a = pklib.aspect(test.a, test.b);
            test.a();
            strictEqual(test.get(), "ba", "Aspecting simple method");
        });
    });
}(this));

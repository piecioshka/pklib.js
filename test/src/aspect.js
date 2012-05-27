(function (global) {
    "use strict";
    var pklib = global.pklib;

    pklib.event.add(global, "load", function () {
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

        test("aspect-after", function () {
            var r = 0,
                a = function() {
                    r = 2;
                },
                b = function () {
                    r = 3;
                };
            pklib.aspect(a, b, "after")();
            strictEqual(r, 3, "'After' aspect it's okey");
        });

        test("aspect-before", function () {
            var r = 0,
                a = function() {
                    r = 2;
                },
                b = function () {
                    r = 3;
                };
            pklib.aspect(a, b, "before")();
            strictEqual(r, 2, "'Before' aspect it's okey");
        });
    });
}(this));

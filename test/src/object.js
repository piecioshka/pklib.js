(function (global) {
    "use strict";
    var pklib = global.pklib;

    pklib.event.add(global, "load", function () {
        module("pklib.object");

        test("is_object", function () {
            strictEqual(pklib.object.is_object({}), true, "{} is a object");
            strictEqual(!pklib.object.is_object(null), true, "null is not a object");
        });

        test("mixin", function() {
            var a1 = [ 1, 2, 3 ],
                a2 = [ 4, "a", 0 ],
                a3 = [ 0, 1, 2, 3, 4, "a" ];
            deepEqual(pklib.object.mixin(a1, a2), a3, "Merge array are OK");
            var a4 = [ 1, 2, 3 ],
                a5 = [ ],
                a6 = [ 1, 2, 3 ];
            deepEqual(pklib.object.mixin(a4, a5), a6, "Merge array are OK");
            var o1 = {
                test: 2,
                dummny: [ 2 ]
            },
                o2 = {
                    test2: 2345,
                    dummny2: [ 561235 ]
                },
                o3 = {
                    test: 2,
                    test2: 2345,
                    dummny: [ 2 ],
                    dummny2: [ 561235 ]
                };
            deepEqual(pklib.object.mixin(o1, o2), o3, "Merge object are OK");
            var o4 = {
                test: 2,
                dummny: [ 2 ]
            },
                o5 = undefined,
                o6 = {
                    test: 2,
                    dummny: [ 2 ]
                };
            deepEqual(pklib.object.mixin(o4, o5), o6, "Merge object are OK");
        });
    });
}(this));

window.addEventListener("load", function () {
    
    module("pklib.array");

    // pklib.array.isArray
    test("isArray", function() {

        var element = document.createElement("div");
        element.id = "pklib-utils-dom-center";

        document.body.appendChild(element);

        var __center = pklib.dom.center(pklib.dom.byId(element.id));

        ok(pklib.array.isArray(__center), "Params are in array");
        strictEqual(__center.length, 2, "Two params");
    });

    // pklib.array.inArray
    test("inArray", function() {

        var __array = [];
        var element = 3;

        __array.push(element);

        ok(pklib.array.inArray(element, __array), "Element is in array");
    });

    // pklib.array.unique
    test("unique", function() {

        var __arrayRedundancy = [ 2, 3, 4, 2, 3, 4 ];
        var __array = [ 2, 3, 4 ];
        var __temp = pklib.array.unique(__arrayRedundancy);

        deepEqual(__temp, __array, "Array with unique elements");
    });

    // pklib.array.remove
    test("remove", function() {

        var __array = [ 1 ];
        var __temp = [ 1 ];
        var element = 3;
        var element2 = 4;

        __array.push(element);
        __array.push(element2);

        pklib.array.remove(__array, element);
        pklib.array.remove(__array, element2);

        deepEqual(__array, __temp, "Elements in array removed");
    });

    // pklib.array.mixin
    test("mixin", function() {

        var a1 = [ 1, 2, 3 ],
            a2 = [ 4, "a", 0 ],
            a3 = [ 0, 1, 2, 3, 4, "a" ];

        deepEqual(pklib.array.mixin(a1, a2), a3, "Merge array are OK");

        var a4 = [ 1, 2, 3 ],
            a5 = [ ],
            a6 = [ 1, 2, 3 ];

        deepEqual(pklib.array.mixin(a4, a5), a6, "Merge array are OK");

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

        deepEqual(pklib.array.mixin(o1, o2), o3, "Merge object are OK");

        var o4 = {
            test: 2,
            dummny: [ 2 ]
        },
        o5 = undefined,
        o6 = {
            test: 2,
            dummny: [ 2 ]
        };

        deepEqual(pklib.array.mixin(o4, o5), o6, "Merge object are OK");
    });

});
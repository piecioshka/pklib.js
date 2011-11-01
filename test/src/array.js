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
    test("merge", function() {

        var __array1 = [ 1, 2, 3 ];
        var __array2 = [ 4, "a", 0 ];

        var __arrayMerge = [ 0, 1, 2, 3, 4, "a" ];

        deepEqual(pklib.array.mixin(__array1, __array2), __arrayMerge, "Merge array are OK");

        var __object1 = {
            test : 2,
            dummny : [ 2 ]
        };
        var __object2 = {
            test2 : 2345,
            dummny2 : [ 561235 ]
        };

        var __objectMerge = {
            test : 2,
            test2 : 2345,
            dummny : [ 2 ],
            dummny2 : [ 561235 ]
        };

        deepEqual(pklib.array.mixin(__object1, __object2), __objectMerge, "Merge object are OK");
    });

});
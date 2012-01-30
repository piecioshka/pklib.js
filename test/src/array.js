pklib.event.add(window, "load", function () {
    
    module("pklib.array");

    test("isArray", function() {
        var element = document.createElement("div");
        element.id = "_test_pklib_array_isArray";
        pklib.dom.insert(element, document.body);
        var center = pklib.ui.center(pklib.dom.byId(element.id));
        ok(pklib.array.isArray(center), "Params are in array");
        strictEqual(center.length, 2, "Two params");
        pklib.dom.remove(element);
    });
    test("inArray", function() {
        var array = [];
        var element = 3;
        array.push(element);
        ok(pklib.array.inArray(element, array), "Element is in array");
    });
    test("index", function () {
    	var array = [1,2,3,4,5];
    	strictEqual(pklib.array.index(4, array), 3, "Element index it's OK");
    });
    test("unique", function() {
        var arrayRedundancy = [ 2, 3, 4, 2, 3, 4 ];
        var array = [ 2, 3, 4 ];
        var temp = pklib.array.unique(arrayRedundancy);
        deepEqual(temp, array, "Array with unique elements");
    });
    test("remove", function() {
        var array = [ 1 ];
        var temp = [ 1 ];
        var element = 3;
        var element2 = 4;
        array.push(element);
        array.push(element2);
        pklib.array.remove(array, element, element2);
        deepEqual(array, temp, "Elements in array removed");
    });
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
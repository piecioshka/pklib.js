pklib.event.add(window, "load", function () {
    
    module("pklib.json");

    test("stringify", function() {
        var __array = [ 2, 3 ];
        var test = pklib.json.stringify(__array);
        var result = "[\n\t2,\n\t3\n]";
        strictEqual(test, result, "Array is made to string");
        test = pklib.json.stringify(__array, 3);
        result = "[\n\t\t\t\t\t\t\t2,\n\t\t\t\t3\n\t\t\t]";
        strictEqual(test, result, "Array with indent is made to string");
        strictEqual(pklib.json.stringify(), undefined, "Object is undefined");
        strictEqual(pklib.json.stringify(undefined), undefined, "Object is undefined");
        strictEqual(pklib.json.stringify(null), null, "Object is null");
    });
    test("serialize", function() {
        var __object = {
            "kaczuszka" : [ "k", 4 ]
        };
        var test = pklib.json.serialize(__object);
        var result = "kaczuszka=k,4";
        strictEqual(test, result, "Object is made to string");
        test = pklib.json.serialize(__object, true);
        result = '{kaczuszka:"k,4"}';
        strictEqual(test, result, "Object is made to string");
        try {
            pklib.json.serialize();
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Object is made to string");
        }
        try {
            pklib.json.serialize();
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Object is undefined");
        }
        try {
            pklib.json.serialize(undefined);
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Object is undefined");
        }
        try {
            pklib.json.serialize(null);
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Object is null");
        }
    });
});

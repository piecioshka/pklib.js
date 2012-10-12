/********************************************************************************/
/* pklib.array TestCase */
/********************************************************************************/

buster.testCase("pklib.array", {
    "is_array": function () {
        var element = document.createElement("div");
        element.setAttribute("id", "array-is-array");
        pklib.dom.insert(element, document.body);
        var center = pklib.ui.center(element);
        assert(pklib.array.is_array(center), "Params are in array");
        assert.equals(center.length, 2, "Two params");
        pklib.dom.remove(element);
    },

    "in_array": function () {
        var array = [];
        var element = 3;
        array.push(element);
        assert(pklib.array.in_array(element, array), "Element is in array");
    },

    "index": function () {
        var array = [1, 2, 3, 4, 5];
        assert.equals(pklib.array.index(4, array), 3, "Element index it's OK");
    },

    "unique": function () {
        var arrayRedundancy = [2, 3, 4, 2, 3, 4];
        var array = [2, 3, 4];
        var temp = pklib.array.unique(arrayRedundancy);
        assert.equals(temp, array, "Array with unique elements");
    },

    "remove": function () {
        var array = [1, 2, 3, 4];
        pklib.array.remove(array, 2, 3);
        assert.equals(array.length, 2, "Elements in array removed");
    }
});

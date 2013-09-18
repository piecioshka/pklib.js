/**
 * @module pklib.array
 */
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});
    var to_string = Object.prototype.toString;

    /**
     * Check if param is array.
     * @param {Object} array
     * @return {boolean}
     */
    function is_array(array) {
        return array !== null &&
            typeof array === "object" &&
            to_string.call(array) === "[object Array]" &&
            typeof array.length === "number" &&
            typeof array.slice === "function";
    }

    /**
     * Check if element is in array by loop.
     * @param {*} param
     * @param {Array} array
     * @return {boolean}
     */
    function in_array(param, array) {
        var i, len = array.length;
        for (i = 0; i < len; ++i) {
            if (array[i] === param) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get index of element.
     * If couldn't find searching element, return null value.
     * @param {*} item
     * @param {Array} array
     * @return {number|null}
     */
    function index(item, array) {
        var i, len = array.length;
        for (i = 0; i < len; ++i) {
            if (array[i] === item) {
                return i;
            }
        }
        return null;
    }

    /**
     * Unique array. Delete element what was duplicated.
     * @param {Array} array
     * @return {Array}
     */
    function unique(array) {
        var i, item, temp = [],
            len = array.length;

        for (i = 0; i < len; ++i) {
            item = array[i];
            if (!in_array.call(null, item, temp)) {
                temp.push(item);
            }
        }
        return temp;
    }

    /**
     * Remove element declared in infinity params without first.
     * First parameter is array object.
     * @param {Array} array
     * @return {Array}
     */
    function remove(array) {
        var i, param,
            params = [].slice.call(arguments, 1),
            len = params.length;

        for (i = 0; i < len; ++i) {
            param = params[i];
            if (in_array(param, array)) {
                array.splice(index(param, array), 1);
            }
        }
        return array;
    }

    // exports
    pklib.array = {
        is_array: is_array,
        in_array: in_array,
        index: index,
        unique: unique,
        remove: remove
    };

}(this));

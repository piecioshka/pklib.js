/**
 * @module pklib.object
 */
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});
    var is_array = pklib.array.is_array;
    var in_array = pklib.array.in_array;
    var to_string = Object.prototype.toString;

    /**
     * Check if param is object.
     * @param {Object} it
     * @return {boolean}
     */
    function is_object(it) {
        return it &&
            to_string.call(it) === "[object Object]" &&
            typeof it === "object" &&
            typeof it.hasOwnProperty === "function" &&
            typeof it.isPrototypeOf === "function";
    }

    /**
     * Mix two params, from second to first param. Return first param mixin
     *     with second param.
     * @param {Array|Object} target
     * @param {Array|Object} source
     * @return {Array|Object}
     */
    function mixin(target, source) {
        var i, len, element, item;

        if (is_array(target) && is_array(source)) {
            len = source.length;

            for (i = 0; i < len; ++i) {
                element = source[i];

                if (!in_array(element, target)) {
                    target.push(element);
                }
            }
        } else {
            for (item in source) {
                if (source.hasOwnProperty(item)) {
                    if (is_object(target[item])) {
                        target[item] = mixin(target[item], source[item]);
                    } else {
                        target[item] = source[item];
                    }
                }
            }
        }
        return target;
    }

    /**
     * Check if object is empty (contains non-value).
     * @param {Object} obj
     * @returns {boolean}
     */
    function is_empty(obj) {
        var i, items = 0;

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                items++;
            }
        }
        return !items;
    }

    // exports
    pklib.object = {
        is_object: is_object,
        mixin: mixin,
        is_empty: is_empty
    };

}(this));

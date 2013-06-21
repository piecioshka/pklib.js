/**
 * @package pklib.object
 */
(function (global) {
    "use strict";

    // imports
    var pklib = global.pklib;
    var is_array = pklib.array.is_array;
    var in_array = pklib.array.in_array;
    var to_string = Object.prototype.toString;

    /**
     * Check if param is object
     *
     * @param {Object} obj
     * @returns {Boolean}
     */
    function is_object(obj) {
        return obj &&
            to_string.call(obj) === "[object Object]" &&
            typeof obj === "object" &&
            typeof obj.hasOwnProperty === "function" &&
            typeof obj.isPrototypeOf === "function";
    }

    /**
     * Mix two params, from second to first param. Return first param mixin with second param
     *
     * @param {Array|Object} target
     * @param {Array|Object} source
     * @returns {Array|Object}
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

    // exports
    pklib.object = {
        is_object: is_object,
        mixin: mixin
    };

}(this));


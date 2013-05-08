/**
 * @package pklib.object
 */

/**
 * Module to service object
 */
pklib.object = (function () {
    "use strict";

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

        if (pklib.array.is_array(target) && pklib.array.is_array(source)) {
            len = source.length;

            for (i = 0; i < len; ++i) {
                element = source[i];

                if ( !pklib.array.in_array(element, target) ) {
                    target.push(element);
                }
            }
        } else {
            for (item in source) {
                if (source.hasOwnProperty(item)) {
                    if (pklib.object.is_object(target[item])) {
                        target[item] = pklib.object.mixin(target[item], source[item]);
                    } else {
                        target[item] = source[item];
                    }
                }
            }
        }
        return target;
    }

    // exports
    return {
        is_object: is_object,
        mixin: mixin
    };
}());


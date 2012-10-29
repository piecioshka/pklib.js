/**
 * @package pklib.object
 */

/**
 * Module to service object
 */
pklib.object = (function () {
    "use strict";

    /**
     * Check if param is object
     *
     * @param {Object} obj
     * @returns {Boolean}
     */
    function is_object(obj) {
        return obj && typeof obj === "object" &&
            typeof obj.hasOwnProperty === "function" &&
            typeof obj.isPrototypeOf === "function" &&
            obj.length === undefined;
    }

    /**
     * Mix two params, from second to first param. Return first param mixin with second param
     *
     * @param {Array|Object} target
     * @param {Array|Object} source
     * @returns {Array}
     */
    function mixin(target, source) {
        var i, len, element, item;

        if (pklib.array.is_array(target) && pklib.array.is_array(source)) {
            len = source.length;
            for (i = 0; i < len; ++i) {
                element = source[i];
                if (!pklib.array.in_array(element, target)) {
                    target.push(element);
                }
            }
            target.sort();
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

    // public API
    return {
        is_object: is_object,
        mixin: mixin
    };
}());


/**
 * @package pklib.object
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {};

    /**
     * Module to service object
     * @namespace
     */
    pklib.object =  {
        /**
         * Check if is object
         * @memberOf pklib.object
         * @function
         * @param {Object} obj
         * @returns {Boolean}
         */
        is_object: function (obj) {
            return obj && typeof obj === "object" &&
                typeof obj.hasOwnProperty === "function" &&
                typeof obj.isPrototypeOf === "function" &&
                typeof obj.length === "undefined";
        },

        /**
         * @memberOf pklib.object
         * @function
         * @param {Array|Object} target
         * @param {Array|Object} source
         * @returns {Array}
         */
        mixin: function (target, source) {
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
    };

}(this));

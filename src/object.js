/**
 * @package pklib.object
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        /**
         * Module to service object
         * @namespace
         */
        object =  {
            /**
             * Check if is object
             * @memberOf object
             * @function
             * @param {Object} o
             * @returns {Boolean}
             */
            is_object: function (o) {
                return o && typeof o === "object" &&
                    typeof o.hasOwnProperty === "function" &&
                    typeof o.isPrototypeOf === "function" &&
                    typeof o.length === "undefined";
            },
            /**
             * @memberOf object
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

    pklib.object = object;
}(this));

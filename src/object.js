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
            isObject: function (o) {
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
                var i, len = 0, element, item;

                if (pklib.array.isArray(target) && pklib.array.isArray(source)) {
                    len = source.length;
                    for (i = 0; i < len; ++i) {
                        element = source[i];
                        if (!pklib.array.inArray(element, target)) {
                            target.push(element);
                        }
                    }
                    target.sort();
                } else {
                    for (item in source) {
                        if (source.hasOwnProperty(item)) {
                            if (pklib.object.isObject(target[item])) {
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
/**
 * Module to service object
 * @package pklib.object
 */
(function (global) {
    "use strict";
    var pklib = global.pklib || {};

    pklib.object =  {
        /**
         * Check if is object
         * @param o {Object}
         * @return {Boolean}
         */
        isObject: function (o) {
            return o && typeof o === "object" &&
                typeof o.hasOwnProperty === "function" &&
                typeof o.isPrototypeOf === "function" &&
                typeof o.length === "undefined";
        },
        /**
         * @param target {Array | Object}
         * @param source {Array | Object}
         * @return {Array}
         */
        mixin: function mixin(target, source) {
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
                return target;
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
                return target;
            }
        }
    };
}(this));
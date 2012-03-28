/**
 * @package pklib.common
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        /**
         * Common stuff
         * @namespace
         */
        common = {
            /**
             * @memberOf pklib.common
             * @function
             * @param {Object} v
             * @param {Object} r
             */
            assert: function (v, r) {
                return v === r;
            },
            /**
             * @memberOf pklib.common
             * @function
             * @param {Function} func
             */
            defer: function (func) {
                setTimeout(func, 0);
            }
        };

    pklib.common = common;
}(this));
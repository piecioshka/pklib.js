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
             * @memberOf common
             * @function
             * @param {Object} v First object to compare
             * @param {Object} r Second object to compare
             */
            assert: function (v, r) {
                return v === r;
            },
            /**
             * @memberOf common
             * @function
             * @param {Function} func Function what would be defered
             */
            defer: function (func) {
                setTimeout(func, 0);
            }
        };

    pklib.common = common;
}(this));

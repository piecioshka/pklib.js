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
             * Basic test function. Simple assertion 2 variables
             * @memberOf common
             * @function
             * @param {Object} left First object to compare
             * @param {Object} right Second object to compare
             */
            assert: function (left, right) {
                return left === right;
            },
            /**
             * Deferred function about some milliseconds.
             * If milliseconds is 0 that it's hack for some platforms to use function in "next" thread
             * @memberOf common
             * @function
             * @param {Function} defer_function Function what would be deferred
             * @param {Number} milliseconds Time to deferred function
             */
            defer: function (defer_function, milliseconds) {
                milliseconds = milliseconds || 0;
                setTimeout(defer_function, milliseconds);
            }
        };

    pklib.common = common;
}(this));

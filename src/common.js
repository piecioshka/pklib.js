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
             * Defered function about 0 miliseconds.
             * It's hack for some platforms to use function in "next" thread
             * @memberOf common
             * @function
             * @param {Function} defer_function Function what would be defered
             */
            defer: function (defer_function) {
                setTimeout(defer_function, 0);
            }
        };

    pklib.common = common;
}(this));

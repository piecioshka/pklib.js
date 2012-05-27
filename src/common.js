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
             * @param {Object} expression Object what is true
             * @param {String} comment Message to throw in error
             * @throws {Error} If
             */
            assert: function (expression, comment) {
                if (expression !== true) {
                    throw new Error(comment);
                }
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
                global.setTimeout(defer_function, milliseconds);
            }
        };

    pklib.common = common;
}(this));

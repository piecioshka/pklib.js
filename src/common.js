/**
 * @package pklib.common
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {};

    /**
     * Common stuff
     * @namespace
     */
    pklib.common = {
        /**
         * Basic test function. Simple assertion 2 variables
         * @memberOf pklib.common
         * @function
         * @param {Object} expression Object what is true
         * @param {String} comment Message to throw in error
         * @throws {Error}
         */
        assert: function (expression, comment) {
            if (expression !== true) {
                throw new Error(comment);
            }
        },
        /**
         * Deferred function about some milliseconds.
         * If milliseconds is 0 that it's hack for some platforms to use function in "next" thread
         * @memberOf pklib.common
         * @function
         * @param {Function} defer_function Function what would be deferred
         * @param {Number} milliseconds Time to deferred function
         */
        defer: function (defer_function, milliseconds) {
            milliseconds = milliseconds || 0;
            setTimeout(defer_function, milliseconds);
        },
        /**
         * Interval checking first function until returns true,
         * run after this second function callback
         * @memberOf pklib.common
         * @param {Function} condition Function returns {Boolean} status
         * @param {Function} callback
         */
        checking: function (condition, callback) {
            var interval,
                interval_time = 100;

            pklib.common.assert(typeof condition === "function", "pklib.common.checking: @condition: not {Function}");
            pklib.common.assert(typeof callback === "function", "pklib.common.checking: @callback: not {Function}");

            if (condition()) {
                callback();
            } else {
                interval = setInterval(function () {
                    if (condition()) {
                        clearInterval(interval);
                        callback();
                    }
                }, interval_time);
            }
        }
    };

}(this));

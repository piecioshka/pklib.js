/**
 * @module pklib.common
 */
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    /**
     * Basic test function. Simple assertion 2 variables.
     * @param {boolean} expression Object what is true.
     * @param {string} comment Message to throw in error.
     * @throws {Error} Condition it's not true.
     */
    function assert(expression, comment) {
        if (expression !== true) {
            throw new Error(comment);
        }
    }

    /**
     * Deferred function about some milliseconds.
     * If milliseconds is 0 that it's hack for some platforms to use function
     * in "next" thread.
     * @param {Function} defer_function Function what would be deferred.
     * @param {number} [milliseconds] Time to deferred function
     */
    function defer(defer_function, milliseconds) {
        milliseconds = milliseconds || 0;
        setTimeout(defer_function, milliseconds);
    }

    /**
     * Interval checking first function until returns true, run after this
     * second function callback.
     * @param {Function} condition Function returns {@type boolean} status.
     * @param {Function} callback
     */
    function checking(condition, callback) {
        var interval,
            interval_time = 100;

        assert(typeof condition === "function", "pklib.common.checking: @condition: not {Function}");
        assert(typeof callback === "function", "pklib.common.checking: @callback: not {Function}");

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

    // exports
    pklib.common = {
        assert: assert,
        defer: defer,
        checking: checking
    };

}(this));

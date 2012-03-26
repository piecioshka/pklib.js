/**
 * @package pklib.aspect
 */
(function (global) {
    "use strict";

    /** @namespace */
    var pklib = global.pklib || {},

        /**
         * Bind function to aspect
         * Create method with merge first and second.
         * Second method is run after first.
         * @param {Function} fun The function to bind aspect function
         * @param {Function} asp The aspect function
         * @namespace
         * @throws {TypeError} If any param is not function
         * @returns {Function}
         */
        aspect = function (fun, asp) {
            var that = this;
            if (typeof fun !== "function") {
                throw new TypeError("pklib.aspect: @func: not function");
            }
            if (typeof asp !== "function") {
                throw new TypeError("pklib.aspect: @asp: not function");
            }
            return function () {
                asp.call(that);
                return fun.apply(that, arguments);
            };
        };

    pklib.aspect = aspect;
}(this));

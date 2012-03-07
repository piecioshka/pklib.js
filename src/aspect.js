/**
 * Bind function to aspect
 * @package pklib.aspect
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {};

    /**
     * Create method with merge first and second.
     * Second method is run after first.
     * @param fun {Function} The function to bind aspect function
     * @param asp {Function} The aspect function
     * @throws {TypeError}
     * @return {Function}
     */
    pklib.aspect = function aspect(fun, asp) {
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
}(this));

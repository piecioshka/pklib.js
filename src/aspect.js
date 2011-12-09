/**
 * @package aspect
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {};

    /**
     * Create method with merge first and second.
     * Second method is run after first.
     *
     * @param fun {Function} The function to bind aspect function
     * @param asp {Function} The aspect function
     */
    pklib.aspect = function (fun, asp) {
        var that = this;
        if (typeof fun !== "function" || typeof asp !== "function") {
            throw new TypeError("Params are not functions");
        }
        return function () {
            asp.call(that);
            return fun.apply(that, arguments);
        };
    };
}(this));

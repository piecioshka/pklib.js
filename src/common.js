/**
 * Common stuff
 * @package pklib.common
 */
(function (global) {
    "use strict";
    var pklib = global.pklib;

    pklib.common = {
        assert: function assert(v, r) {
            return v === r;
        },
        defer: function defer(func) {
            setTimeout(func, 0);
        }
    };
}(this));
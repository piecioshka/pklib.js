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
            assert: function (v, r) {
                return v === r;
            },
            defer: function (func) {
                setTimeout(func, 0);
            }
        };

    pklib.common = common;
}(this));
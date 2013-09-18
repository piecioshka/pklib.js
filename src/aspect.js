/**
 * @requires pklib.common
 */
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    /**
     * Bind function to aspect.
     * Create method with merge first and second.
     * Second method is run after first.
     * @module pklib.aspect
     * @param {Function} fun The function to bind aspect function.
     * @param {Function} asp The aspect function.
     * @param {string} [when="before"] Place to aspect function.
     * @return {Function}
     * @throws {TypeError} If any param is not function.
     */
    pklib.aspect = function (fun, asp, when) {

        // private
        var self = this, result;
        var assert = pklib.common.assert;

        assert(typeof fun === "function", "pklib.aspect: @func: not {Function}");
        assert(typeof asp === "function", "pklib.aspect: @asp: not {Function}");

        when = when || "before";

        return function () {
            if (when === "before") {
                asp.call(self);
            }

            result = fun.apply(self, arguments);

            if (when === "after") {
                result = asp.call(self);
            }

            return result;
        };
    };

}(this));
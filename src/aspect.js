/**
 * @package pklib.aspect
 */
(function (global) {
    "use strict";

    // imports
    var pklib = global.pklib;
    var assert = pklib.common.assert;

    /**
     * Bind function to aspect.
     * Create method with merge first and second.
     * Second method is run after first.
     * @param {Function} fun The function to bind aspect function.
     * @param {Function} asp The aspect function.
     * @param {string} [when] Place to aspect function.
     * @throws {TypeError} If any param is not function.
     * @return {Function}
     */
    pklib.aspect = function (fun, asp, when) {

        // private
        var self = this, result;

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
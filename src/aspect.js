/**
 * @package pklib.aspect
 */

/**
 * Bind function to aspect.
 * Create method with merge first and second.
 * Second method is run after first
 *
 * @function
 * @param {Function} fun The function to bind aspect function
 * @param {Function} asp The aspect function
 * @param {String} [when="before"] Place to aspect function
 * @throws {TypeError} If any param is not function
 * @returns {Function}
 */
pklib.aspect = function (fun, asp, when) {
    "use strict";

    var that = this,
        result;

    pklib.common.assert(typeof fun === "function", "pklib.aspect: @func: not {Function}");
    pklib.common.assert(typeof asp === "function", "pklib.aspect: @asp: not {Function}");

    when = when || "before";

    return function () {
        if (when === "before") {
            asp.call(that);
        }

        result = fun.apply(that, arguments);

        if (when === "after") {
            result = asp.call(that);
        }
        return result;
    };
};

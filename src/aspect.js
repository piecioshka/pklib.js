/**
 * @package aspect
 */
pklib = this.pklib || {};

/**
 * Create method with merge first and second.
 * Second method is run after first.
 *
 * @param fun {function} The function to bind aspect function
 * @param asp {function} The aspect function
 */
pklib.aspect = function(fun, asp) {
    if( typeof fun !== "function" || typeof asp !== "function") {
        throw new TypeError("Params are not functions");
    }

    var that = this;

    return function() {
        asp.call(that);
        return fun.apply(that, arguments);
    };
};

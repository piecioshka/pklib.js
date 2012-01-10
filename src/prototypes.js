/**
 * @package prototypes
 */
Function.prototype.method = function (name, func) {
    "use strict";
    this.prototype[name] = func;
    return this;
};

Function.method("bind", function (that) {
    "use strict";
    var method = this,
        slice = Array.prototype.slice,
        args = slice.apply(arguments, [1]);
    return function () {
        return method.apply(that, args.concat(slice.apply(arguments, [0])));
    };
});
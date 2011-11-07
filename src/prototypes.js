/**
 * @package prototypes
 */
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

Function.method("bind", function (that) {
    var method = this,
        slice = Array.prototype.slice,
        args = slice.apply(arguments, [1]);
        
    return function () {
        return method.apply(that, args.concat(slice.apply(arguments, [0])));
    };
});
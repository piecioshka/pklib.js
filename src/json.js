/**
 * JSON manager
 * @package json
 */
(function (win) {
    'use strict';

    var pklib = win.pklib || {};

    function getFunctionName(fun) {
        var text = fun.toString().split("\n")[0].replace("function ", "");
        return text.substr(0, text.indexOf("(")) + "()";
    }
    function getLastElement(object) {
        var i,
            len = 0;
        for (i in object) {
            if (object.hasOwnProperty(i)) {
                len += 1;
            }
        }
        return len;
    }
    function getIndent(len) {
        var i,
            fix = "\t",
            source = "";
        for (i = 0; i < len; i += 1) {
            source += fix;
        }
        return source;
    }

    pklib.json = {
        /**
         * @param object {Array}
         * @return {String}
         */
        stringify: function (object) {
            var source = "",
                args = Array.prototype.slice.call(arguments),
                index = args[1] || 0,
                i,
                item,
                len = 0;

            // Undefined
            if (typeof object === "undefined") {
                return undefined;
            } else if (object === null) {
                // Null
                return null;
            } else if (typeof object === "boolean") {
                // Boolean
                return object;
            } else if (typeof object === "number") {
                // Number
                return object;
            } else if (typeof object === "string") {
                // String
                return '"' + object + '"';
            } else if (typeof object === "function") {
                // Function
                return getFunctionName(object);
            } else if (typeof object === "object" && typeof object.slice === "function") {
                // Array
                if (object.length === 0) {
                    return "[]";
                }
                source = "[\n" + getIndent(index);
                index += 1;
                len = object.length;
                for (i = 0; i < len; i += 1) {
                    source += getIndent(index) + this.stringify(object[i], index);
                    if (i !== len - 1) {
                        source += ",\n";
                    }
                }
                index -= 1;
                source += "\n" + getIndent(index) + "]";
            } else if (typeof object === "object") {
                // Object
                source = "{\n";
                index += 1;
                for (item in object) {
                    if (object.hasOwnProperty(item)) {
                        source += getIndent(index) + '"' + item + '": ' + this.stringify(object[item], index);
                        if (item !== getLastElement(object)) {
                            source += ",\n";
                        }
                    }
                }
                index -= 1;
                source += "\n" + getIndent(index) + "}";
            }

            return source;
        },
        /**
         * @param object {Object}
         * @param toJson {Boolean}
         * @returns {String}
         */
        serialize: function (source, toJson) {
            if (typeof source !== "object" || source === null) {
                throw new TypeError("pklib.json.serialize: Source is null or not object");
            }

            var amp = false,
                item,
                value,
                mtz,
                response = '';

            if (toJson) {
                response += "{";
            }
            for (item in source) {
                if (source.hasOwnProperty(item)) {
                    if (amp) {
                        if (toJson) {
                            response += ',';
                        } else {
                            response += '&';
                        }
                    } else {
                        amp = true;
                    }

                    value = '';
                    if (typeof source[item] !== "undefined" && source[item] !== null) {
                        value = source[item];
                    }

                    mtz = toJson ? '"' : '';
                    response += item;
                    response += toJson ? ':' : '=';
                    response += mtz;
                    response += value + mtz;
                }
            }
            if (toJson) {
                response += "}";
            }

            return response;
        }
    };
}(this));

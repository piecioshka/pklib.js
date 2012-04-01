/**
 * @package pklib.json, pklib.string
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        /**
         * @private
         * @function
         * @param {Function} fun
         * @returns {String}
         */
        getFunctionName = function (fun) {
            var text = fun.toString().split("\n")[0].replace("function ", "");
            return text.substr(0, text.indexOf("(")) + "()";
        },
        /**
         * @private
         * @function
         * @param {Object} object
         * @returns {Number}
         */
        getLastElement = function (object) {
            var i,
                len = 0;
            for (i in object) {
                if (object.hasOwnProperty(i)) {
                    len += 1;
                }
            }
            return len;
        },
        /**
         * @private
         * @function
         * @param {Number} len
         * @returns {String}
         */
        getIndent = function (len) {
            var i,
                fix = "\t",
                source = "";
            for (i = 0; i < len; ++i) {
                source += fix;
            }
            return source;
        },
        /**
         * JSON manager
         * @namespace
         */
        json = {
            /**
             * @memberOf json
             * @function
             * @param {Array} object
             * @returns {String}
             */
            stringify: function (object) {
                var source = "",
                    args = Array.prototype.slice.call(arguments),
                    index = args[1] || 0,
                    i,
                    item,
                    len = 0;

                switch (true) {
                    case typeof object === "undefined":
                        // Undefined
                        source = undefined;
                        break;
                    case object === null:
                        // Null
                        source = null;
                        break;
                    case typeof object === "boolean":
                        // Boolean
                        source = object;
                        break;
                    case typeof object === "number":
                        // Number
                        source = object;
                        break;
                    case pklib.string.isString(object):
                        // String
                        source = '"' + object + '"';
                        break;
                    case typeof object === "function":
                        // Function
                        source = getFunctionName(object);
                        break;
                    case pklib.array.isArray(object):
                        // Array
                        if (object.length === 0) {
                            return "[]";
                        }
                        source = "[\n" + getIndent(index);
                        index += 1;
                        len = object.length;
                        for (i = 0; i < len; ++i) {
                            source += getIndent(index) + pklib.json.stringify(object[i], index);
                            if (i !== len - 1) {
                                source += ",\n";
                            }
                        }
                        index -= 1;
                        source += "\n" + getIndent(index) + "]";
                        break;
                    case pklib.object.isObject(object):
                        // Object
                        source = "{\n";
                        index += 1;
                        for (item in object) {
                            if (object.hasOwnProperty(item)) {
                                source += getIndent(index) + '"' + item + '": ' + pklib.json.stringify(object[item], index);
                                if (item !== getLastElement(object)) {
                                    source += ",\n";
                                }
                            }
                        }
                        index -= 1;
                        source += "\n" + getIndent(index) + "}";
                        break;
                    default:
                        source = "---";
                    }

                return source;
            },
            /**
             * @memberOf json
             * @function
             * @param {Object} source
             * @param {Boolean} toJson
             * @throws {TypeError} If first param is not object, second is null
             * @returns {String}
             */
            serialize: function (source, toJson) {
                if (typeof source !== "object" || pklib.common.assert(source, null)) {
                    throw new TypeError("pklib.json.serialize: @source: not {Object}");
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

    pklib.json = json;
}(this));

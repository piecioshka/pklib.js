/**
 * @package pklib.json
 */
pklib = this.pklib || {};
pklib.json = (function() {

    var __json = {

        /**
         * @param {array} object
         * @param {number} ind
         * @return {string}
         */
        stringify : function(object, ind) {
            var source = "", type = "", index = ind || 0;

            function indent(len) {
                for ( var i = 0, preffix = "\t", source = ""; i < len; ++i) {
                    source += preffix;
                }
                return source;
            }

            // Undefined
            if (typeof object === "undefined") {
                type = undefined;
                return type;
            } else

            // Null
            if (object == null) {
                type = null;
                return type;
            } else

            // Boolean
            if (typeof object === "boolean") {
                type = "boolean";
                return object;
            } else

            // Number
            if (typeof object === "number") {
                type = "number";
                return object;
            } else

            // String
            if (typeof object === "string") {
                type = "string";
                return '"' + object + '"';
            } else

            // Function
            if (typeof object === "function") {
                type = "function";

                function __getName(fun) {
                    var text = fun.toString();
                    text = text.split("\n")[0].replace("function ", "");
                    return text.substr(0, text.indexOf("(")) + "()";
                }

                return __getName(object);
            } else

            // Array
            if (typeof object === "object" && typeof object.slice === "function") {
                type = "array";
                if (object.length === 0) {
                    return "[]";
                }
                source = "[\n" + indent(index);
                index++;
                for ( var i = 0, len = object.length; i < len; ++i) {
                    source += indent(index) + arguments.callee(object[i], index);
                    if (i !== len - 1) {
                        source += ",\n";
                    }
                }
                index--;
                source += "\n" + indent(index) + "]";
            } else

            // Object
            if (typeof object === "object") {
                type = "object";

                function __getLast(object) {
                    for ( var i in object) {
                    }
                    return i;
                }

                source = "{\n";
                index++;
                for ( var item in object) {
                    source += indent(index) + item + ": " + arguments.callee(object[item], index);
                    if (item !== __getLast(object)) {
                        source += ",\n";
                    }
                }
                index--;
                source += "\n" + indent(index) + "}";
            }

            return source;
        },

        /**
         * @param {object} object
         * @param {boolean} toJson
         * @returns {string}
         */
        serialize : function(object, toJson) {
            if (typeof object !== "object" || object == null) {
                throw new TypeError();
            }

            var addAmp = false, response = '';

            response += (toJson) ? '{' : '';

            for ( var i in object) {
                if (typeof object[i] !== "function") {
                    if (addAmp) {
                        var lst = toJson ? ',' : '&';
                        response += lst;
                    } else {
                        addAmp = true;
                    }

                    var value = '';
                    if (typeof object[i] !== "undefined" && object[i] !== null) {
                        value = object[i];
                    }

                    var bef = toJson ? ':' : '=';
                    var mtz = toJson ? '"' : '';
                    response += i + bef + mtz + value + mtz;
                }
            }

            response += (toJson) ? '}' : '';

            return response;
        }

    };

    return __json;

})();

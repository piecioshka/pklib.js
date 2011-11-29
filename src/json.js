/**
 * @package json
 */
pklib = this.pklib || {};

/**
 * JSON manager
 */
pklib.json = (function () {

    function __getFunctionName(fun) {
        var text = fun.toString().split("\n")[0].replace("function ", "");
        return text.substr(0, text.indexOf("(")) + "()";
    }

    function __getLastElement(object) {
        for(var i in object) {}
        return i;
    }

    function __getIndent(len) {
        for(var i = 0, preffix = "\t", source = ""; i < len; ++i) {
            source += preffix;
        }
        return source;
    }

    return {

        /**
         * @param {array} object
         * @return {string}
         */
        stringify: function (object) {
            var source = "",
                args = Array.prototype.slice.call(arguments),
                index = args[1] || 0;

            // Undefined
            if (typeof object === "undefined") {
                return undefined;
            } else

            // Null
            if (object == null) {
                return null;
            } else

            // Boolean
            if (typeof object === "boolean") {
                return object;
            } else

            // Number
            if (typeof object === "number") {
                return object;
            } else

            // String
            if (typeof object === "string") {
                return '"' + object + '"';
            } else

            // Function
            if (typeof object === "function") {
                return __getFunctionName(object);
            } else

            // Array
            if (typeof object === "object" && typeof object.slice === "function") {
                if (object.length === 0) {
                    return "[]";
                }
                source = "[\n" + __getIndent(index);
                index++;
                for(var i = 0, len = object.length; i < len; ++i) {
                    source += __getIndent(index) + arguments.callee(object[i], index);
                    if (i !== len - 1) {
                        source += ",\n";
                    }
                }
                index--;
                source += "\n" + __getIndent(index) + "]";
            } else

            // Object
            if (typeof object === "object") {
                source = "{\n";
                index++;
                for(var item in object) {
                    if (object.hasOwnProperty(item)) {
                        source += __getIndent(index) + '"' + item + '": ' + arguments.callee(object[item], index);
                        if (item !== __getLastElement(object)) {
                            source += ",\n";
                        }
                    }
                }
                index--;
                source += "\n" + __getIndent(index) + "}";
            }

            return source;
        },
        
        /**
         * @param {object} object
         * @param {boolean} toJson
         * @returns {string}
         */
        serialize: function (source, toJson) {
            if (typeof source !== "object" || source == null) {
                throw new TypeError("pklib.json.serialize: Source is null or not object");
            }

            var amp = false, 
                response = ''; 

            toJson && (response += "{");
            
            for(var item in source) {
                if (source.hasOwnProperty(item)) {
                    
                    amp ? response += toJson ? ',': '&': ( amp = true);

                    var value = '';
                    if (typeof source[item] !== "undefined" && source[item] !== null) {
                        value = source[item];
                    }

                    var mtz = toJson ? '"': '';
                    response += item;
                    response += toJson ? ':': '=';
                    response += mtz;
                    response += value + mtz;
                }
            }
            
            toJson && (response += "}");

            return response;
        }
    };

})();

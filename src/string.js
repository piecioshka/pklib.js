/**
 * @package string
 */
pklib = this.pklib || {};

/**
 * String service manager
 */
pklib.string = (function() {
    
    return {
    
        /**
         * @param {any Object} source
         * @return {boolean}
         */
        isString : function(source) {
            return typeof source === "string";
        },
    
        /**
         * @param {any Object} source
         * @return {boolean}
         */
        isLetter : function(source) {
            return typeof source === "string" && /^[a-zA-Z]$/.test(source);
        },
    
        /**
         * @param {string} source
         * @return {string}
         */
        trim : function(source) {
            return source.replace(/^\s+|\s+$/g, "");
        },
    
        /**
         * @param {string} source
         * @return {string}
         */
        slug : function(source) {
            var result = source.toLowerCase().replace(/\s/mg, "-");
            result = result.replace(/[^a-zA-Z0-9\-]/mg, function(ch) {
                switch (ch.charCodeAt()) {
                    case 261:
                        return String.fromCharCode(97);
                    case 281:
                        return String.fromCharCode(101);
                    case 243:
                        return String.fromCharCode(111);
                    case 347:
                        return String.fromCharCode(115);
                    case 322:
                        return String.fromCharCode(108);
                    case 378:
                    case 380:
                        return String.fromCharCode(122);
                    case 263:
                        return String.fromCharCode(99);
                    case 324:
                        return String.fromCharCode(110);
    
                    default:
                        return "";
                }
            });
            return result;
        },
    
        /**
         * @param {string} source
         * @return {string}
         */
        capitalize : function(source) {
            return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
        },
    
        /**
         * @param {string} source
         * @return {string}
         */
        delimiterSeparatedWords : function(source) {
            return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function(match) {
                return "-" + match.toLowerCase();
            });
        },
    
        /**
         * @param {string} source
         * @return {string}
         */
        camelCase : function(source) {
            while (source.indexOf("-") != -1) {
                var pos = source.indexOf("-");
                var pre = source.substr(0, pos);
                var sub = source.substr(pos + 1, 1).toUpperCase();
                var post = source.substring(pos + 2, source.length);
                source = pre + sub + post;
            }
            return source;
        },
    
        /**
         * @param {string} source
         * @param {number} len
         * @return {string}
         */
        slice : function(source, len) {
            for ( var item = 0, text = "", num = source.length; item < num; ++item) {
                text += source[item];
                if (item == len - 1) {
                    if (num - len >= 1) {
                        text += "...";
                    }
                    break;
                }
            }
    
            return text;
        }
    
    };
    
})();

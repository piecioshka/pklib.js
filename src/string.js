/**
 * String service manager
 * @package string
 */

(function (win) {
    'use strict';

    var pklib = win.pklib || {};

    pklib.string = {
        /**
         * @param source {var}
         * @return {Boolean}
         */
        isString: function (source) {
            return typeof source === "string";
        },
        /**
         * @param source {var}
         * @return {Boolean}
         */
        isLetter: function (source) {
            return typeof source === "string" && /^[a-zA-Z]$/.test(source);
        },
        /**
         * @param source {String}
         * @return {String}
         */
        trim: function (source) {
            return source.replace(/^\s+|\s+$/g, "");
        },
        /**
         * @param source {String}
         * @return {String}
         */
        slug: function (source) {
            var result = source.toLowerCase().replace(/\s/mg, "-");
            result = result.replace(/[^a-zA-Z0-9\-]/mg, function (ch) {
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
         * @param source {String}
         * @return {String}
         */
        capitalize: function (source) {
            return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
        },
        /**
         * @param source {String}
         * @return {String}
         */
        delimiterSeparatedWords: function (source) {
            return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function (match) {
                return "-" + match.toLowerCase();
            });
        },
        /**
         * @param source {String}
         * @return {String}
         */
        strip_tags: function (source) {
            return source.replace(/\\<\\S\\>/g, "");
        },
        /**
         * @param source {String}
         * @return {String}
         */
        camelCase: function (source) {
            while (source.indexOf("-") !== -1) {
                var pos = source.indexOf("-"),
                    pre = source.substr(0, pos),
                    sub = source.substr(pos + 1, 1).toUpperCase(),
                    post = source.substring(pos + 2, source.length);
                source = pre + sub + post;
            }
            return source;
        },
        /**
         * @param source {String}
         * @param len {Number}
         * @return {String}
         */
        slice: function (source, len) {
            var item,
                text = "",
                num = source.length;
            for (item = 0; item < num; item += 1) {
                text += source[item];
                if (item === len - 1) {
                    if (num - len >= 1) {
                        text += "...";
                    }
                    break;
                }
            }
            return text;
        }
    };
}(this));

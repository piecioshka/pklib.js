/**
 * @package pklib.string
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        document = global.document || {},
        /**
         * String service manager
         * @namespace
         */
        string = {
            /**
             * @memberOf string
             * @function
             * @param {String} source
             * @returns {Boolean}
             */
            is_string: function (source) {
                return typeof source === "string";
            },
            /**
             * @memberOf string
             * @function
             * @param {String} source
             * @returns {Boolean}
             */
            is_letter: function (source) {
                return pklib.string.is_string(source) && /^[a-zA-Z]$/.test(source);
            },
            /**
             * @memberOf string
             * @function
             * @param {String} source
             * @returns {String}
             */
            trim: function (source) {
                return source.replace(/^\s+|\s+$/g, "");
            },
            /**
             * @memberOf string
             * @function
             * @param {String} source
             * @returns {String}
             */
            slug: function (source) {
                var result = source.toLowerCase().replace(/\s/mg, "-");
                result = result.replace(/[^a-zA-Z0-9\-]/mg, function (ch) {
                    switch (ch.charCodeAt(0)) {
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
             * @memberOf string
             * @function
             * @param {String} source
             * @returns {String}
             */
            capitalize: function (source) {
                return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
            },
            /**
             * @memberOf string
             * @function
             * @param {String} source
             * @returns {String}
             */
            delimiter_separated_words: function (source) {
                return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function (match) {
                    return "-" + match.toLowerCase();
                });
            },
            /**
             * @memberOf string
             * @function
             * @param {String} source
             * @returns {String}
             */
            strip_tags: function (source) {
                pklib.common.assert(typeof source === "string", "pklib.string.strip_tags: param @source is not a string");
                if (source && source.length !== 0) {
                    var dummy = document.createElement("div");
                    dummy.innerHTML = source;
                    return dummy.textContent || dummy.innerText;
                }
                return source;
            },
            /**
             * @memberOf string
             * @function
             * @param {String} source
             * @returns {String}
             */
            camel_case: function (source) {
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
             * @memberOf string
             * @function
             * @param {String} source
             * @param {Number} length
             * @returns {String}
             */
            slice: function (source, length) {
                var item,
                    text = "",
                    num = source.length;

                for (item = 0; item < num; item += 1) {
                    text += source.substr(item, 1);
                    if (item === length - 1) {
                        if (num - length >= 1) {
                            text += "...";
                        }
                        break;
                    }
                }
                return text;
            }
        };

    pklib.string = string;
}(this));

/**
 * @package pklib.string
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        document = global.document || {};

    /**
     * String service manager
     * @namespace
     */
    pklib.string = {
        /**
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @returns {Boolean}
         */
        is_string: function (source) {
            return typeof source === "string";
        },

        /**
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @returns {Boolean}
         */
        is_letter: function (source) {
            return pklib.string.is_string(source) && /^[a-zA-Z]$/.test(source);
        },

        /**
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @returns {String}
         */
        trim: function (source) {
            return source.replace(/^\s+|\s+$/g, "");
        },

        /**
         * @memberOf pklib.string
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
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @returns {String}
         */
        capitalize: function (source) {
            return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
        },

        /**
         * @memberOf pklib.string
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
         * @memberOf pklib.string
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
         * @memberOf pklib.string
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
         * @memberOf pklib.string
         * @function
         * @param {String} source Text to slice
         * @param {Number} length Number of chars what string will be slice
         * @param {Boolean} [is_force] Force mode. If slice will be end in middle of word, use this to save it, or algorytm slice to last space
         * @returns {String}
         */
        slice: function (source, length, is_force) {
            pklib.common.assert(typeof source === "string", "pklib.string.slice: param @source is not a string");

            // jeśli długość przycinania jest wiąksza niż długość całego tekstu
            // to zwracamy przekazany tekst
            if (source.length < length) {
                return source;
            }

            // ucinamy tyle tekstu ile jest wskazane w parametrze length
            var text = source.slice(0, length);

            // sprawdzamy czy nie ucieliśmy w połowie wyrazu:
            // * tj. czy kolejnym znakiem nie jest spacja
            if (source[length] === " ") {
                return text + "...";
            }

            // * ostatnim znakiem w uciętym tekście jest spacja
            if (text[length - 1] === " ") {
                return pklib.string.trim(text) + "...";
            }

            // jesli nie ma wymuszenia przycinania wyrazu w jego części 
            // to sprawdzamy czy możemy przyciąć do ostatniej spacji w przycietym tekście
            if (!is_force) {
                // niestety ucieliśmy tekst w połowie wyrazu
                // postępujemy zgodnie z intrukcja, że odnajdujemy ostatnią spację
                // i obcinamy fraze do tej spacji 
                var last_space = text.lastIndexOf(" ");

                // spacja została znaleziona, więc przycinamy frazę do spacji
                if (last_space !== -1) {
                    return text.slice(0, last_space) + "...";
                }
            }

            // włączony tryb "force" albo spacja nie została odnaleziona więc aby nie zwracać 
            // w pustej wartości, ucinamy wyraz w tym miejscu w którym jest
            return text + "...";
        }
    };

}(this));

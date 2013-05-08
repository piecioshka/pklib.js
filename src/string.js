/**
 * @package pklib.string
 */

/**
 * String service manager
 */
pklib.string = (function () {
    "use strict";

    /**
     * @param {String} source
     * @returns {Boolean}
     */
    function is_string(source) {
        return typeof source === "string";
    }

    /**
     * @param {String} source
     * @returns {Boolean}
     */
    function is_letter(source) {
        return pklib.string.is_string(source) && /^[a-zA-Z]$/.test(source);
    }

    /**
     * @param {String} source
     * @returns {String}
     */
    function trim(source) {
        return source.replace(/^\s+|\s+$/g, "");
    }

    /**
     * @param {String} source
     * @returns {String}
     */
    function slug(source) {
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
    }

    /**
     * @param {String} source
     * @returns {String}
     */
    function capitalize(source) {
        return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
    }

    /**
     * @param {String} source
     * @returns {String}
     */
    function delimiter_separated_words(source) {
        return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function (match) {
            return "-" + match.toLowerCase();
        });
    }

    /**
     * @param {String} source
     * @returns {String}
     */
    function strip_tags(source) {
        pklib.common.assert(typeof source === "string", "pklib.string.strip_tags: param @source is not a string");
        if (source && source.length !== 0) {
            var dummy = document.createElement("div");
            dummy.innerHTML = source;
            return dummy.textContent || dummy.innerText;
        }
        return source;
    }

    /**
     * @param {String} source
     * @returns {String}
     */
    function camel_case(source) {
        while (source.indexOf("-") !== -1) {
            var pos = source.indexOf("-"),
                pre = source.substr(0, pos),
                sub = source.substr(pos + 1, 1).toUpperCase(),
                post = source.substring(pos + 2, source.length);
            source = pre + sub + post;
        }
        return source;
    }

    /**
     * @param {String} source Text to slice
     * @param {Number} length Number of chars what string will be slice
     * @param {Boolean} [is_force] Force mode. If slice will be end in middle of word, use this to save it, or algorytm slice to last space
     * @returns {String}
     */
    function slice(source, length, is_force) {
        pklib.common.assert(typeof source === "string", "pklib.string.slice: param @source is not a string");

        // jeśli długość przycinania jest wiąksza niż długość całego tekstu
        // to zwracamy przekazany tekst
        if (source.length < length) {
            return source;
        }

        // ucinamy tyle tekstu ile jest wskazane w parametrze length
        var text = source.slice(0, length), last_space;

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
            last_space = text.lastIndexOf(" ");

            // spacja została znaleziona, więc przycinamy frazę do spacji
            if (last_space !== -1) {
                return text.slice(0, last_space) + "...";
            }
        }

        // włączony tryb "force" albo spacja nie została odnaleziona więc aby nie zwracać 
        // w pustej wartości, ucinamy wyraz w tym miejscu w którym jest
        return text + "...";
    }

    /**
     * Replace tags in string to defined data
     * Tags:
     * ${NAME} - replace by value of object["NAME"]
     *
     * @param {String} str Some string to replace by objects
     * @param {Object} obj Object what will serve data to replacer
     *
     * @example
     *
     * In: 
     * %{car} is the best!
     *
     * Run: 
     * pklib.string.format("%{car} is the best", { car: "Ferrari" });
     *
     * Out: 
     * Ferrari is the best!
     */
    function format(str, obj) {
        var name;

        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                str = str.replace(new RegExp("%{" + name + "}", "ig"), obj[name]);
            }
        }

        return str;
    }

    /**
     * Left padding any chars
     *
     * @param {String} staff Object what be padding on the left
     * @param {Number} nr_fill Padding size
     * @param {String} add_char Char what be added
     */
    function lpad(staff, nr_fill, add_char) {
        var string = staff.toString(),
            i = string.length;

        for (; i < nr_fill; ++i) {
            string = add_char + string;
        }

        return string;
    }

    /**
     * Right padding any chars
     *
     * @param {String} staff Object what be padding on the right
     * @param {Number} nr_fill Padding size
     * @param {String} add_char Char what be added
     */
    function rpad(staff, nr_fill, add_char) {
        var string = staff.toString(),
            i = string.length;

        for (; i < nr_fill; ++i) {
            string += add_char;
        }

        return string;
    }

    // exports
    return {
        is_string: is_string,
        is_letter: is_letter,
        trim: trim,
        slug: slug,
        capitalize: capitalize,
        delimiter_separated_words: delimiter_separated_words,
        strip_tags: strip_tags,
        camel_case: camel_case,
        slice: slice,
        format: format,
        lpad: lpad,
        rpad: rpad
    };
}());


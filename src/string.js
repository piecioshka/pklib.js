(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    /**
     * @param {string} source
     * @return {boolean}
     */
    function is_string(source) {
        return typeof source === "string";
    }

    /**
     * @param {string} source
     * @return {boolean}
     */
    function is_letter(source) {
        return is_string(source) && (/^[a-zA-Z]$/).test(source);
    }

    /**
     * @param {string} source
     * @return {string}
     */
    function trim(source) {
        return source.replace(/^\s+|\s+$/g, "");
    }

    /**
     * @param {string} source
     * @return {string}
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
     * @param {string} source
     * @return {string}
     */
    function capitalize(source) {
        return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
    }

    /**
     * @param {string} source
     * @return {string}
     */
    function delimiter_separated_words(source) {
        return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function (match) {
            return "-" + match.toLowerCase();
        });
    }

    /**
     * @param {string} source
     * @return {string}
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
     * @param {string} source
     * @return {string}
     */
    function camel_case(source) {
        var pos, pre, sub, post;

        while (source.indexOf("-") !== -1) {
            pos = source.indexOf("-");
            pre = source.substr(0, pos);
            sub = source.substr(pos + 1, 1).toUpperCase();
            post = source.substring(pos + 2, source.length);
            source = pre + sub + post;
        }
        return source;
    }

    /**
     * @param {string} source Text to slice.
     * @param {number} length number of chars what string will be slice.
     * @param {boolean} [is_force] Force mode. If slice will be end in middle.
     *     of word, use this to save it, or algorithm slice to last space.
     * @return {string}
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
            return trim(text) + "...";
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
     * Replace tags in string to defined data.
     * ${NAME} - replace by value of object["NAME"]
     * @param {string} str Some string to replace by objects.
     * @param {Object} obj Object what will serve data to replace.
     * @example
     * %{car} is the best!
     * pklib.string.format("%{car} is the best", { car: "Ferrari" });
     * //=> Ferrari is the best!
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
     * Left padding any chars.
     * @param {string} staff Object what be padding on the left.
     * @param {number} nr_fill Padding size.
     * @param {string} add_char Char what be added.
     */
    function lpad(staff, nr_fill, add_char) {
        var i, string = staff.toString();

        for (i = string.length; i < nr_fill; ++i) {
            string = add_char + string;
        }
        return string;
    }

    /**
     * Right padding any chars.
     * @param {string} staff Object what be padding on the right.
     * @param {number} nr_fill Padding size.
     * @param {string} add_char Char what be added.
     */
    function rpad(staff, nr_fill, add_char) {
        var i, string = staff.toString();

        for (i = string.length; i < nr_fill; ++i) {
            string += add_char;
        }
        return string;
    }

    /**
     * @module pklib.string
     * @type {{is_string: Function, is_letter: Function, trim: Function, slug: Function, capitalize: Function, delimiter_separated_words: Function, strip_tags: Function, camel_case: Function, slice: Function, format: Function, lpad: Function, rpad: Function}}
     */
    pklib.string = {
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

}(this));


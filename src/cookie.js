/**
 * @module pklib.cookie
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    /**
     * Read cookie by it name.
     * @param {string|undefined} name
     * @return {string|null}
     */
    function get_cookie(name) {
        if (name === undefined) {
            return null;
        }
        name += "=";
        var i, c,
            ca = document.cookie.split(";"),
            len = ca.length;

        for (i = 0; i < len; ++i) {
            c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(name) === 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return null;
    }

    /**
     * Create cookie file with name, value and day expired.
     * @param {string} name
     * @param {string} [value]
     * @param {number} [days]
     * @return {string}
     */
    function create_cookie(name, value, days) {
        var expires = "",
            date = new Date();

        value = value || null;

        if (days !== undefined) {
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }

        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";

        return get_cookie(name);
    }

    /**
     * Delete cookie by it name.
     * @param {string} name
     * @return {string}
     */
    function remove_cookie(name) {
        return create_cookie(name, undefined, -1);
    }

    // exports
    pklib.cookie = {
        create: create_cookie,
        get: get_cookie,
        remove: remove_cookie
    };

}(this));

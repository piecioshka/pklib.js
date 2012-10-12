/**
 * @package pklib.cookie
 */

/**
 * Cookie service manager
 * @namespace
 */
pklib.cookie = (function () {
    "use strict";

    /**
     * Read cookie by it name
     *
     * @private
     * @function
     * @param {String} name
     * @returns {String|Null}
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
     * Create cookie file with name, value and day expired
     *
     * @private
     * @function
     * @param {String} name
     * @param {String} [value]
     * @param {Number} [days]
     * @returns {String}
     */
    function create_cookie(name, value, days) {
        var expires = "",
            date = new Date();

        value = value || null;

        if (days !== undefined) {
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }

        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";

        return get_cookie(name);
    }

    /**
     * Delete cookie by it name
     *
     * @private
     * @function
     * @param {String} name
     * @returns {String}
     */
    function remove_cookie(name) {
        return create_cookie(name, undefined, -1);
    }

    // public API
    return {
        create: create_cookie,
        get: get_cookie,
        remove: remove_cookie
    };
}());

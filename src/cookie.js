/**
 * @package pklib.cookie
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
     * Cookie service manager
     * @namespace
     */
    pklib.cookie = {
        /**
         * Create cookie file with name, value and day expired
         * @memberOf pklib.cookie
         * @function
         * @param {String} name
         * @param {String} value
         * @param {Number} days
         * @returns {String}
         */
        create: function (name, value, days) {
            var expires = "",
                date = new Date();

            value = value || null;

            if (typeof days !== "undefined") {
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            }

            document.cookie = name + "=" + value + expires + "; path=/";

            return pklib.cookie.get(name);
        },

        /**
         * Read cookie by it name
         * @memberOf pklib.cookie
         * @function
         * @param {String} name
         * @returns {String|Null}
         */
        get: function (name) {
            if (typeof name === "undefined") {
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
                    return c.substring(name.length, c.length);
                }
            }
            return null;
        },

        /**
         * Delete cookie by it name
         * @memberOf pklib.cookie
         * @function
         * @param {String} name
         * @returns {String}
         */
        remove: function (name) {
            return pklib.cookie.create(name, undefined, -1);
        }
    };

}(this));

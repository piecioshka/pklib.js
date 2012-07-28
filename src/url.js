/**
 * @package pklib.url
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        /**
         * Document.location object
         * @private
         * @type {Object}
         */
        loc = global.location || {};

    /**
     * Url helper manager
     * @namespace
     */
    pklib.url = {
        /**
         * @memberOf pklib.url
         * @function
         * @returns {String}
         */
        get_protocol: function () {
            return loc.protocol;
        },

        /**
         * @memberOf pklib.url
         * @function
         * @returns {String}
         */
        get_host: function () {
            return loc.host;
        },

        /**
         * @memberOf pklib.url
         * @function
         * @returns {String}
         */
        get_port: function () {
            return loc.port || 80;
        },

        /**
         * @memberOf pklib.url
         * @function
         * @returns {String}
         */
        get_uri: function () {
            return loc.pathname;
        },

        /**
         * Get all params, and return in JSON object
         * @memberOf pklib.url
         * @function
         * @returns {Object}
         */
        get_params: function () {
            var i,
                item,
                len,
                params = loc.search,
                params_list = {};

            if (params.substr(0, 1) === "?") {
                params = params.substr(1);
            }

            params = params.split("&");
            len = params.length;

            for (i = 0; i < len; ++i) {
                item = params[i].split("=");
                params_list[item[0]] = item[1];
            }
            return params_list;
        },

        /**
         * Get concrete param from URL.
         * If param if not defined return null
         * @memberOf pklib.url
         * @function
         * @param {String} key
         * @returns {String}
         */
        get_param: function (key) {
            var params = loc.search,
                i,
                item,
                len;

            if (params.substr(0, 1) === "?") {
                params = params.substr(1);
            }

            params = params.split("&");
            len = params.length;

            for (i = 0; i < len; ++i) {
                item = params[i].split("=");
                if (item[0] === key) {
                    return item[1];
                }
            }
            return null;
        },

        /**
         * @memberOf pklib.url
         * @function
         * @returns {String}
         */
        get_hash: function () {
            return loc.hash;
        }
    };

}(this));

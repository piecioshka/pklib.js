/**
 * @package pklib.url
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        /**
         * Document.location object
         */
        loc = global.location || {},
        /**
         * Url helper manager
         * @namespace
         */
        url = {
            /**
             * @memberOf url
             * @function
             * @returns {String}
             */
            getProtocol: function () {
                return loc.protocol;
            },
            /**
             * @memberOf url
             * @function
             * @returns {String}
             */
            getHost: function () {
                return loc.host;
            },
            /**
             * @memberOf url
             * @function
             * @returns {String}
             */
            getPort: function () {
                return loc.port || 80;
            },
            /**
             * @memberOf url
             * @function
             * @returns {String}
             */
            getUri: function () {
                return loc.pathname;
            },
            /**
             * Get all params, and return in JSON object
             * @memberOf url
             * @function
             * @returns {Object}
             */
            getParams: function () {
                var i,
                    item,
                    len,
                    params = loc.search,
                    paramsList = {};

                if (params.substr(0, 1) === "?") {
                    params = params.substr(1);
                }

                params = params.split("&");
                len = params.length;

                for (i = 0; i < len; ++i) {
                    item = params[i].split("=");
                    paramsList[item[0]] = item[1];
                }
                return paramsList;
            },
            /**
             * Get conrete param from URL.
             * If param if not defined return null
             * @memberOf url
             * @function
             * @param {String} key
             * @returns {String}
             */
            getParam: function (key) {
                var params = loc.search,
                    i,
                    item,
                    len = 0;

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
             * @memberOf url
             * @function
             * @returns {String}
             */
            getHash: function () {
                return loc.hash;
            }
        };

    pklib.url = url;
}(this));

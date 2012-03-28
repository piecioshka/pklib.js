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
        loc = global.location,
        /**
         * Url helper manager
         * @namespace
         */
        url = {
            /**
             * @returns {String}
             */
            getProtocol: function () {
                return loc.protocol;
            },
            /**
             * @returns {String}
             */
            getHost: function () {
                return loc.host;
            },
            /**
             * @returns {String}
             */
            getPort: function () {
                return loc.port || 80;
            },
            /**
             * @returns {String}
             */
            getUri: function () {
                return loc.pathname;
            },
            /**
             * @returns {Array}
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
             * @param {String} key
             * @returns {String}
             */
            getParam: function (key) {
                var params = loc.search,
                    i,
                    item,
                    len = params.length;
                if (params.substr(0, 1) === "?") {
                    params = params.substr(1);
                }
                params = params.split("&");
                for (i = 0; i < len; ++i) {
                    item = params[i].split("=");
                    if (item[0] === key) {
                        return item[1];
                    }
                }
                return null;
            },
            /**
             * @returns {String}
             */
            getHash: function () {
                return loc.hash;
            }
        };

    pklib.url = url;
}(this));

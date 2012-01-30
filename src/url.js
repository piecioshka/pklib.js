/**
 * Url helper manager
 * @package pklib.url
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        loc = global.location;

    pklib.url = {
        /**
         * @return {String}
         */
        getProtocol: function () {
            return loc.protocol;
        },
        /**
         * @return {String}
         */
        getHost: function () {
            return loc.host;
        },
        /**
         * @return {String}
         */
        getPort: function () {
            return loc.port || 80;
        },
        /**
         * @return {String}
         */
        getUri: function () {
            return loc.pathname;
        },
        /**
         * @return {Array}
         */
        getParams: function () {
            var i, item, len = 0,
                params = loc.search,
                params_obj = {};
            if (params.substr(0, 1) === "?") {
                params = params.substr(1);
            }
            params = params.split("&");
            len = params.length;
            for (i = 0; i < len; ++i) {
                item = params[i].split("=");
                params_obj[item[0]] = item[1];
            }
            return params_obj;
        },
        /**
         * @param key {String}
         * @return {String}
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
        },
        /**
         * @return {String}
         */
        getHash: function () {
            return loc.hash;
        }
    };
}(this));

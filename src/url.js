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
        getProtocol: function getProtocol() {
            return loc.protocol;
        },
        /**
         * @return {String}
         */
        getHost: function getHost() {
            return loc.host;
        },
        /**
         * @return {String}
         */
        getPort: function getPort() {
            return loc.port || 80;
        },
        /**
         * @return {String}
         */
        getUri: function getUri() {
            return loc.pathname;
        },
        /**
         * @return {Array}
         */
        getParams: function getParams() {
            var i, item, len,
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
         * @param key {String}
         * @return {String}
         */
        getParam: function getParam(key) {
            var params = loc.search,
                i, item,
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
         * @return {String}
         */
        getHash: function getHash() {
            return loc.hash;
        }
    };
}(this));

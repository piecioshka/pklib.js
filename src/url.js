/**
 * Url helper manager
 * @package url
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {},
        loc = win.location;

    pklib.url = {
        getProtocol: function () {
            return loc.protocol;
        },
        getHost: function () {
            return loc.host;
        },
        getPort: function () {
            return loc.port || 80;
        },
        getUri: function () {
            return loc.pathname;
        },
        getParams: function () {
            var params = loc.search,
                params_obj = {},
                i,
                item,
                len = 0;
            if (params.substr(0, 1) === "?") {
                params = params.substr(1);
            }
            params = params.split("&");
            len = params.length;
            for (i = 0; i < len; i += 1) {
                item = params[i].split("=");
                params_obj[item[0]] = item[1];
            }
            return params_obj;
        },
        getParam: function (key) {
            var params = loc.search,
                i,
                item,
                len = params.length;
            if (params.substr(0, 1) === "?") {
                params = params.substr(1);
            }
            params = params.split("&");
            for (i = 0; i < len; i += 1) {
                item = params[i].split("=");
                if (item[0] === key) {
                    return item[1];
                }
            }
        },
        getHash: function () {
            return loc.hash;
        }
    };
}(this));

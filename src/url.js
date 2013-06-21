/**
 * @package pklib.url
 */
(function (global) {
    "use strict";

    // imports
    var pklib = global.pklib;

    /**
     * Get all params, and return in JSON object
     *
     * @returns {Object}
     */
    function get_params() {
        var i,
            item,
            len,
            params = global.location.search,
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
    }

    /**
     * Get concrete param from URL.
     * If param if not defined return null
     *
     * @param {String} key
     * @returns {String}
     */
    function get_param(key) {
        var params = global.location.search,
            i, item, len;

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
    }

    // exports
    pklib.url = {
        get_params: get_params,
        get_param: get_param
    };

}(this));


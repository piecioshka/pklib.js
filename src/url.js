/**
 * @module pklib.url
 */
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    /**
     * Get all params, and return in JSON object.
     * @param {?string} [url]
     * @return {Object}
     */
    function get_params(url) {
        var i,
            item,
            len,
            key_value_section,
            params,
            params_list = {};

        if (typeof url === "string") {
            params = url.match(/\?(.*)/)[0] || "";
        } else {
            params = global.location.search;
        }

        if (params.substr(0, 1) === "?") {
            params = params.substr(1);
        }

        params = params.split("&");
        len = params.length;

        for (i = 0; i < len; ++i) {
            key_value_section = params[i];
            if (key_value_section.length > 0) {
                item = key_value_section.split("=");
                params_list[item[0]] = item[1];
            }
        }
        return params_list;
    }

    /**
     * Get concrete param from URL.
     * If param if not defined return null.
     * @param {string} key
     * @param {?string} url
     * @return {string}
     */
    function get_param(key, url) {
        var params,
            i,
            item,
            len;

        if (typeof url === "string") {
            params = url.match(/\?(.*)/)[0] || "";
        } else {
            params = global.location.search;
        }

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


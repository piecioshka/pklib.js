/**
 * @package pklib.browser
 */

/**
 * Get best information about browser
 * @namespace
 */
pklib.browser = (function (global) {
    "use strict";

    /**
     * Array with browsers name
     *
     * @private
     * @type {Array}
     */
    var browsers = ["msie", "chrome", "safari", "opera", "mozilla", "konqueror"];

    /**
     * Get browser name by checking userAgent in global object navigator
     *
     * @private
     * @function
     * @returns {String}
     */
    function get_name() {
        var i, browser,
            len = browsers.length,
            userAgent = global.navigator.userAgent.toLowerCase();

        for (i = 0; i < len; ++i) {
            browser = browsers[i];
            if (new RegExp(browser).test(userAgent)) {
                return browser;
            }
        }
        return null;
    }

    /**
     * Get browser version by checking userAgent.
     * Parse userAgent to find next 3 characters
     *
     * @private
     * @function
     * @returns {String|Null}
     */
    function get_version() {
        var i, len = browsers.length, browser, cur,
            user_agent = global.navigator.userAgent.toLowerCase();

        for (i = 0; i < len; ++i) {
            browser = browsers[i];
            cur = user_agent.indexOf(browser);
            if (cur !== -1) {
                return user_agent.substr(cur + len + 1, 3);
            }
        }
        return null;
    }

    // public API
    return {
        get_name: get_name,
        get_version: get_version
    };
}(this));

/**
 * @package pklib.browser
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        /**
         * Array with browsers name
         */
        browsers = ["msie", "chrome", "safari", "opera", "mozilla", "konqueror"],
        /**
         * Get best information about browser
         * @namespace
         */
        browser = {
            /**
             * Get browser name by checking userAgent in global object navigator
             * @memberOf browser
             * @returns {String}
             */
            getName: function () {
                var i, browser,
                    len = browsers.length,
                    userAgent = navigator.userAgent.toLowerCase();

                for (i = 0; i < len; ++i) {
                    browser = browsers[i];
                    if (new RegExp(browser).test(userAgent)) {
                        return browser;
                    }
                }
                return "undefined";
            },
            /**
             * Get browser version by checking userAgent.
             * Parse userAgent to find next 3 characters
             * @memberOf browser
             * @function
             * @returns {String}
             */
            getVersion: function () {
                var i, len = browsers.length, browser, cur,
                    userAgent = navigator.userAgent.toLowerCase();

                for (i = 0; i < len; ++i) {
                    browser = browsers[i];
                    cur = userAgent.indexOf(browser);
                    if (cur !== -1) {
                        return userAgent.substr(cur + len + 1, 3);
                    }
                }
                return "-1";
            }
        };

    pklib.browser = browser;
}(this));

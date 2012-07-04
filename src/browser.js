/**
 * @package pklib.browser
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        /**
         * Array with browsers name
         * @type Array
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
             * @function
             * @returns {String}
             */
            get_name: function () {
                var i, browser,
                    len = browsers.length,
                    userAgent = global.navigator.userAgent.toLowerCase();

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
             * @returns {String|Null}
             */
            get_version: function () {
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
        };

    pklib.browser = browser;
}(this));

/**
 * Get best information about browser
 * @package pklib.browser
 */
(function (global) {
    "use strict";
    var pklib = global.pklib || {},
        browsers = ["msie", "chrome", "safari", "opera", "mozilla", "konqueror"];

    pklib.browser = {
        /**
         * Get browser name by checking userAgent in global object navigator.
         * @return {String}
         */
        getName: function getName() {
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
         * Parse userAgent to find next 3 characters.
         * @return {String}
         */
        getVersion: function getVersion() {
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
}(this));

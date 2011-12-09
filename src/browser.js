/**
 * Get best information about browser.
 * @package browser
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {},
        navigator = win.navigator || {},
        browsers = ["msie", "chrome", "safari", "opera", "mozilla", "konqueror"];

    pklib.browser = {

        /**
         * Get browser name by checking userAgent in global object navigator.
         * @return {String}
         */
        getName: function () {
            var i,
                len = browsers.length,
                userAgent = navigator.userAgent.toLowerCase(),
                browser;

            for (i = 0; i < len; i += 1) {
                browser = browsers[i];
                if (new RegExp(browser).test(userAgent)) {
                    return browser;
                }
            }
        },
        /**
         * Get browser version by checking userAgent.
         * Parse userAgent to find next 3 characters.
         * @return {String}
         */
        getVersion: function () {
            var i,
                len = browsers.length,
                userAgent = navigator.userAgent.toLowerCase(),
                browser,
                cur;

            for (i = 0; i < len; i += 1) {
                browser = browsers[i];
                cur = userAgent.indexOf(browser);
                if (cur !== -1) {
                    return userAgent.substr(cur + len + 1, 3);
                }
            }
        }
    };
}(this));

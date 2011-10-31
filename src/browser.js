/**
 * @package browser
 */
pklib = this.pklib || {};

/**
 * Get best information about browser.
 */
pklib.browser = (function () {

    var browsers = ["msie", "chrome", "safari", "opera", "mozilla", "konqueror"];

    return {

        /**
         * Get browser name by checking userAgent in global object navigator.
         *
         * @return {string}
         */
        getName: function () {
            var userAgent = navigator.userAgent.toLowerCase();

            for(var i = 0, len = browsers.length; i < len; ++i) {
                var browser = browsers[i];
                if (new RegExp(browser).test(userAgent)) {
                    return browser;
                }
            }
        },
        
        /**
         * Get browser version by checking userAgent.
         * Parse userAgent to find next 3 characters.
         *
         * @return {string}
         */
        getVersion: function () {
            var userAgent = navigator.userAgent.toLowerCase();

            for(var i = 0, len = browsers.length; i < len; ++i) {
                var browser = browsers[i],
                    cur = userAgent.indexOf(browser);
                if (cur != -1) {
                    return userAgent.substr(cur + len + 1, 3);
                }
            }
        }
    };

})();

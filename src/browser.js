/**
 * @package pklib.browser
 */
pklib = this.pklib || {};
pklib.browser = (function() {

    var browsers = [ "msie", "chrome", "safari", "opera", "mozilla", "konqueror" ];

    return {

        /**
         * @return {string}
         */
        getName : function() {
            var userAgent = navigator.userAgent.toLowerCase();

            for ( var i = 0, len = browsers.length; i < len; ++i) {
                var browser = browsers[i];
                if (new RegExp(browser).test(userAgent)) {
                    return browser;
                }
            }
        },

        /**
         * @return {string}
         */
        getVersion : function() {
            var userAgent = navigator.userAgent.toLowerCase();

            for ( var i = 0, len = browsers.length; i < len; ++i) {
                var browser = browsers[i], len = browser.length, cur = userAgent.indexOf(browser);
                if (cur != -1) {
                    return userAgent.substr(cur + len + 1, 3);
                }
            }
        }
    };

})();

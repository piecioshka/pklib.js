pklib = this.pklib || {};

pklib.browser = (function() {

	var browsers = [ "msie", "chrome", "safari", "opera", "mozilla", "konqueror" ];

	var obj = {

		getName : function() {
			var userAgent = navigator.userAgent.toLowerCase();
			for ( var i = 0; i < browsers.length; ++i) {
				var browser = browsers[i];
				if (new RegExp(browser).test(userAgent)) {
					return browser;
				}
			}
			return undefined;
		},

		getVersion : function() {
			var userAgent = navigator.userAgent.toLowerCase();

			for ( var i = 0; i < browsers.length; ++i) {
				var browser = browsers[i], len = browser.length, cur = userAgent
						.indexOf(browser);
				if (cur != -1) {
					return userAgent.substr(cur + len + 1, 3);
				}
			}
			return undefined;
		}
	};

	return obj;
})();
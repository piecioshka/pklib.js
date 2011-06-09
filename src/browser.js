pklib = this.pklib || {};

pklib.browser = (function() {

	return {

		getName: function() {
			var browser = navigator.userAgent.toLowerCase();
			
	        if (/msie/.test(browser)) return 'msie';
	        if (/chrome/.test(browser)) return 'chrome';
	        if (/safari/.test(browser)) return 'safari';
	        if (/opera/.test(browser)) return 'opera';
	        if (/mozilla/.test(browser)) return 'mozilla';
	        if (/konqueror/.test(browser)) return 'konqueror';
	        
	        return null;
	    },
	
	    getVersion: function() {
	        return jQuery.browser.version;
	    }

	};

})();
pklib = this.pklib || {};

pklib.browser = (function() {

	return {

		getName: function() {
	        if (/msie/.test(navigator.userAgent.toLowerCase())) return 'msie';
	        if (/chrome/.test(navigator.userAgent.toLowerCase())) return 'chrome';
	        if (/safari/.test(navigator.userAgent.toLowerCase())) return 'safari';
	        if (/opera/.test(navigator.userAgent.toLowerCase())) return 'opera';
	        if (/mozilla/.test(navigator.userAgent.toLowerCase())) return 'mozilla';
	        return null;
	    },
	
	    getVersion: function() {
	        return jQuery.browser.version;
	    }

	};

})();
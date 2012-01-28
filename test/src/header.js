(function (global) {
	
	if (typeof global.console === "undefined") {
		console = {
			log: function () { },
			info: function () { },
			warn: function () { }
		}
	}
}(this));
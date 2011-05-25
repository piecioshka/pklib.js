pklib = this.pklib || {};

pklib.file = (function() {

	return {
			
		attach: function(data, callback) {
	    	var file = document.createElement( data.tag );
			for( var key in data){
	            file[key] = data[key];
			}
			var attach_file = document.getElementsByTagName(data.section)[0].appendChild(file);
	        if (typeof callback === 'function') {
	            attach_file.onload = callback();
	        }
	        return attach_file;
	    }
	
	};

})();
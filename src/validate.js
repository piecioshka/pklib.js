pklib = this.pklib || {};

pklib.validate = (function(){
	
	return {

        // Check if object doesn't empty
        empty: function(object) {
            switch(typeof object){
                case 'string': return ( object === '' ); break;
                case 'number': return ( object === 0 ); break;
                case 'object': return ( object.length === 0 ); break;
                default: return false;
            }
        },

        // Check regular expression for field and run action
        regexp: function(config) {
            var settings = {
                object: null,
                regexp: null,
                error: null,
                success: null
            };

            jQuery.extend(settings, config);

            var exp = new RegExp(settings.regexp);

            if (exp.test(settings.object)) {
                return settings.success();
            }
            
            return settings.error();
        }

    };

})();

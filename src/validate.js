/**
 * @package pklib.validate
 * @dependence pklib.utils
 */
pklib = this.pklib || {};
pklib.validate = (function(){
	
	var __validate = {

        empty: function(obj) {
            switch(typeof obj){
                case "string": return ( obj === '' ); break;
                case "number": return ( obj === 0 ); break;
                case "object": return ( obj.length === 0 ); break;
                default: return false;
            }
        },

        regexp: function(config) {
            var settings = {
                object: null,
                regexp: null,
                error: null,
                success: null
            };

            settings = pklib.utils.merge(settings, config);

            var exp = new RegExp(settings.regexp);

            if (exp.test(settings.object)) {
                return settings.success();
            }
            
            return settings.error();
        }

    };
	
	return __validate;

})();

/**
 * @package pklib.validate
 * @dependence pklib.utils
 */
pklib = this.pklib || {};
pklib.validate = (function() {

    return {

        /**
         * @param {object} object
         * @return {boolean}
         */
        empty : function(object) {
            if (object == null) {
                return true;
            } else if (pklib.utils.array.isArray(object)) {
                return (object.length === 0);
            } else {
                switch (typeof object) {
                    case "string":
                        return (object === '');
                        break;
                    case "number":
                        return (object === 0);
                        break;
                    case "object":
                        var iterator = 0;
                        for ( var item in object) {
                            if (object.hasOwnProperty(item)) {
                                iterator++;
                            }
                        }
                        return (iterator === 0);
                        break;

                    case "undefined":
                }
                return false;
            }
        },

        /**
         * @param {object} config
         * <pre>
         * { 
         *      object {string}
         *      regexp {object}
         * 
         *      error {function},
         *      success {function}
         * }
         * </pre>
         * 
         * @return {function}
         */
        regexp : function(config) {
            var settings = {
                object : null,
                regexp : null,
                error : function() {
                },
                success : function() {
                }
            };

            settings = pklib.utils.merge(settings, config);

            if(settings.regexp == null){
                throw new TypeError();
            }
            var exp = new RegExp(settings.regexp);

            if(settings.object == null){
                throw new TypeError();
            }
            if (exp.test(settings.object)) {
                return (typeof settings.success === "function") && settings.success();
            }

            return (typeof settings.error === "function") && settings.error();
        }

    };

})();

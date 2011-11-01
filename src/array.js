/**
 * @package array
 */
pklib = this.pklib || {};

/**
 * Module to service array object.
 */
pklib.array = (function () {

    return {

        /**
         * Check if object is array,
         * Check by:
         * - typeof object
         * - not null
         * - typeof object.length
         * - typeof object.slice
         * 
         * @param {HTMLElement} obj
         * @return {boolean}
         */
        isArray: function (obj) {
            return typeof obj === "object" && obj != null && typeof obj.length !== "undefined" && typeof obj.slice !== "undefined";
        },
        
        /**
         * Check if element is in array by loop.
         * 
         * @param {any Object) param
         * @param {array} array
         * @return {boolean or number}
         */
        inArray: function (param, array) {
            for(var i = 0, len = array.length; i < len; ++i) {
                if (array[i] === param) {
                    return true;
                }
            }
            return false;
        },
        
        /**
         * Unique array. Delete element what was duplicated.
         * 
         * @param {array} array
         * @return {array}
         */
        unique: function (array) {
            for(var i = 0, temp = [], len = array.length; i < len; ++i) {
                var item = array[i];
                if (this.inArray.call(null, item, temp) === false) {
                    temp.push(item);
                }
            }
            return temp;
        },
        
        /**
         * Remove element declarated in infinity params without first.
         * First parameter is array object.
         * 
         * @param {array} array
         * @param {any Object}...
         * @return {array}
         */
        remove: function (array /*,  */) {
            var params = Array.prototype.splice.call(arguments, 1);
            for(var i = 0, len = params.length; i < len; ++i) {
                var param = params[i], 
                    inside = this.inArray(param, array);
                if (inside !== false) {
                    array.splice(inside, 1);
                }
            }
            return array;
        },
        
        /**
         * @param {array or object} target
         * @param {array or object} source
         * @return {array}
         */
        mixin: function (target, source) {
            if (this.isArray(target) && this.isArray(source)) {
                for(var i = 0, len = source.length; i < len; ++i) {
                    var element = source[i];
                    if (!this.inArray(element, target)) {
                        target.push(element);
                    }
                }
                return target.sort();
            } else {
                for(var item in source) {
                    if (source.hasOwnProperty(item)) {
                        target[item] = source[item];
                    }
                }
                return target;
            }
        }
    };

})();

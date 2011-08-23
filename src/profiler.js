/**
 * @package pklib.profiler
 */
pklib = this.pklib || {};
pklib.profiler = (function() {

    var data = {};

    return {

        /**
         * @param {string} name
         * @return {number}
         */
        start : function(name) {
            data[name] = new Date();
            return data[name];
        },

        /**
         * @param {string} name
         * @return {number}
         */
        stop : function(name) {
            data[name] = new Date() - data[name];
            return new Date((new Date()).getTime() + data[name]);
        },

        /**
         * @param {string} name
         * @return {number}
         */
        getTime : function(name) {
            return data[name];
        }

    };

})();

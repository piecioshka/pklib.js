/**
 * @package pklib.profiler
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        data = {},
        /**
         * Time analyzer
         * @namespace
         */
        profiler = {
            /**
             * @memberOf profiler
             * @function
             * @param {String} name
             * @returns {Number}
             */
            start: function (name) {
                data[name] = new Date();
                return data[name];
            },
            /**
             * @memberOf profiler
             * @function
             * @param {String} name
             * @returns {Number}
             */
            stop: function (name) {
                data[name] = new Date() - data[name];
                return new Date((new Date()).getTime() + data[name]);
            },
            /**
             * @memberOf profiler
             * @function
             * @param {String} name
             * @returns {Number}
             */
            get_time: function (name) {
                return data[name];
            }
        };

    pklib.profiler = profiler;
}(this));

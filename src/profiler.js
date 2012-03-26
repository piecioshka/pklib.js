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
             * @param name {String}
             * @returns {Number}
             */
            start: function (name) {
                data[name] = new Date();
                return data[name];
            },
            /**
             * @param name {String}
             * @returns {Number}
             */
            stop: function (name) {
                data[name] = new Date() - data[name];
                return new Date((new Date()).getTime() + data[name]);
            },
            /**
             * @param name {String}
             * @returns {Number}
             */
            getTime: function (name) {
                return data[name];
            }
        };

    pklib.profiler = profiler;
}(this));

/**
 * Time analyzer
 * @package pklib.profiler
 */
(function (global) {
    "use strict";
    var pklib = global.pklib || {},
        data = {};

    pklib.profiler = {
        /**
         * @param name {String}
         * @return {Number}
         */
        start: function start(name) {
            data[name] = new Date();
            return data[name];
        },
        /**
         * @param name {String}
         * @return {Number}
         */
        stop: function stop(name) {
            data[name] = new Date() - data[name];
            return new Date((new Date()).getTime() + data[name]);
        },
        /**
         * @param name {String}
         * @return {Number}
         */
        getTime: function getTime(name) {
            return data[name];
        }
    };
}(this));

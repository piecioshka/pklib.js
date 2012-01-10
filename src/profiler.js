/**
 * Time analyzer
 * @package pklib.profiler
 */
(function (win) {
    "use strict";

    var pklib = win.pklib || {},
        data = {};

    pklib.profiler = {
        /**
         * @param name {String}
         * @return {Number}
         */
        start: function (name) {
            data[name] = new Date();
            return data[name];
        },
        /**
         * @param name {String}
         * @return {Number}
         */
        stop: function (name) {
            data[name] = new Date() - data[name];
            return new Date((new Date()).getTime() + data[name]);
        },
        /**
         * @param name {String}
         * @return {Number}
         */
        getTime: function (name) {
            return data[name];
        }
    };
}(this));

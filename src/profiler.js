/**
 * @package pklib.profiler
 */
(function (global) {
    "use strict";

    // imports
    var pklib = global.pklib;

    // private
    var data = {};

    /**
     * @param {String} name
     * @returns {Number}
     */
    function start(name) {
        data[name] = new Date();
        return data[name];
    }

    /**
     * @param {String} name
     * @returns {Number}
     */
    function stop(name) {
        data[name] = new Date() - data[name];
        return new Date((new Date()).getTime() + data[name]);
    }

    /**
     * @param {String} name
     * @returns {Number}
     */
    function get_time(name) {
        return data[name];
    }

    // exports
    pklib.profiler = {
        start: start,
        stop: stop,
        get_time: get_time
    };

}(this));


/**
 * @package pklib.profiler
 */

/**
 * Time analyzer
 */
pklib.profiler = (function () {
    "use strict";

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
    return {
        start: start,
        stop: stop,
        get_time: get_time
    };
}());


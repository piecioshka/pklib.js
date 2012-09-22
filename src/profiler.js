/**
 * @package pklib.profiler
 */

/**
 * Time analyzer
 * @namespace
 */
pklib.profiler = (function () {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var data = {};

    /**
     * @private
     * @function
     * @param {String} name
     * @returns {Number}
     */
    function start(name) {
        data[name] = new Date();
        return data[name];
    }

    /**
     * @private
     * @function
     * @param {String} name
     * @returns {Number}
     */
    function stop(name) {
        data[name] = new Date() - data[name];
        return new Date((new Date()).getTime() + data[name]);
    }

    /**
     * @private
     * @function
     * @param {String} name
     * @returns {Number}
     */
    function get_time(name) {
        return data[name];
    }

    // public API
    return {
        start: start,
        stop: stop,
        get_time: get_time
    };
}());


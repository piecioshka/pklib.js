/**
 * @module pklib.profiler
 */
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    // private
    var data = {};

    /**
     * @param {string} name
     * @return {number}
     */
    function start(name) {
        data[name] = new Date();
        return data[name];
    }

    /**
     * @param {string} name
     * @return {number}
     */
    function stop(name) {
        data[name] = new Date() - data[name];
        return (new Date((new Date()).getTime() + data[name])).getTime();
    }

    /**
     * @param {string} name
     * @return {number}
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

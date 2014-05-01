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

    /**
     * @module pklib.profiler
     * @type {{start: Function, stop: Function, get_time: Function}}
     */
    pklib.profiler = {
        start: start,
        stop: stop,
        get_time: get_time
    };

}(this));

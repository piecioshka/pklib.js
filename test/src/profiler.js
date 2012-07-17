(function (global) {
    "use strict";

    module("pklib.profiler");

    test("start", function () {
        var startProfiler = pklib.profiler.start();
        strictEqual(typeof startProfiler, "object", "Profiler start time type is number");
        strictEqual(startProfiler.toString(), (new Date()).toString(), "Profiler start about: " + startProfiler);
    });
    test("stop", function () {
        var stopProfiler = pklib.profiler.stop();
        strictEqual(typeof stopProfiler, "object", "Profiler stop time type is number");
        strictEqual(stopProfiler.toString(), (new Date()).toString(), "Profiler stop about: " + stopProfiler);
    });
    test("get_time", function () {
        var startProfiler = pklib.profiler.start("test");
        var stopProfiler = pklib.profiler.stop("test");
        var timeProfiler = pklib.profiler.get_time("test");
        strictEqual(typeof timeProfiler, "number", "Profiler time type is number");
        strictEqual(parseInt(timeProfiler, 10), parseInt(((stopProfiler - startProfiler) / 2), 10), "Profiler time " + timeProfiler);
    });
    asyncTest("get_time(async)", function () {
        var startProfiler = pklib.profiler.start("test"),
            stopProfiler,
            timeProfiler,
            time = 13;
        setTimeout(function() {
            stopProfiler = pklib.profiler.stop("test");
            timeProfiler = pklib.profiler.get_time("test");
            strictEqual(typeof timeProfiler, "number", "Profiler time type is number");
            strictEqual(parseInt(timeProfiler, 10), parseInt(((stopProfiler - startProfiler) / 2), 10), "Profiler time " + timeProfiler);
            start();
        }, time);
    });

}(this));

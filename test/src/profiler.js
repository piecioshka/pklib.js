window.addEventListener("load", function () {
    
    module("pklib.profiler");

    // pklib.profiler.start
    test("start", function() {

        var startProfiler = pklib.profiler.start();

        strictEqual(typeof startProfiler, "object", "Profiler start time type is number");
        strictEqual(startProfiler.toString(), (new Date()).toString(), "Profiler start about: " + startProfiler);
    });

    // pklib.profiler.stop
    test("stop", function() {

        var stopProfiler = pklib.profiler.stop();

        strictEqual(typeof stopProfiler, "object", "Profiler stop time type is number");
        strictEqual(stopProfiler.toString(), (new Date()).toString(), "Profiler stop about: " + stopProfiler);
    });

    // pklib.profiler.getTime
    asyncTest("getTime", function() {

        var startProfiler = pklib.profiler.start("test");
        var time = 13;

        setTimeout(function() {
            var stopProfiler = pklib.profiler.stop("test");
            var timeProfiler = pklib.profiler.getTime("test");
            strictEqual(typeof timeProfiler, "number", "Profiler time type is number");
            strictEqual(timeProfiler, (stopProfiler - startProfiler) / 2, "Profiler time " + timeProfiler);
            start();
        }, time);

    });

});

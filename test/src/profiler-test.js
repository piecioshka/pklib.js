/********************************************************************************/
/* pklib.profiler TestCase */
/********************************************************************************/

buster.testCase("pklib.profiler", {
    "start": function () {
        var startProfiler = pklib.profiler.start();
        var current_time = (new Date()).toString();
        assert.equals(typeof startProfiler, "object", "Profiler start time type is number");
        assert.equals(startProfiler.toString(), current_time, "Profiler start about: " + startProfiler);
    },

    /*
    "stop": function () {
        // TODO: sometimes occur error
        var stopProfiler = pklib.profiler.stop();
        var current_time = (new Date()).toString();
        assert.equals(typeof stopProfiler, "object", "Profiler stop time type is number");
        assert.equals(stopProfiler.toString(), current_time, "Profiler stop about: " + stopProfiler);
    },
    */

    "get_time": function () {
        var startProfiler = pklib.profiler.start("test");
        var stopProfiler = pklib.profiler.stop("test");
        var timeProfiler = pklib.profiler.get_time("test");
        assert.equals(typeof timeProfiler, "number", "Profiler time type is number");
        assert.equals(parseInt(timeProfiler, 10), parseInt(((stopProfiler - startProfiler) / 2), 10), "Profiler time " + timeProfiler);
    }

    /*
    "get_time(async)": function () {
        var startProfiler = pklib.profiler.start("test"),
            stopProfiler,
            timeProfiler,
            time = 13;
        setTimeout(function() {
            stopProfiler = pklib.profiler.stop("test");
            timeProfiler = pklib.profiler.get_time("test");
            assert.equals(typeof timeProfiler, "number", "Profiler time type is number");
            assert.equals(parseInt(timeProfiler, 10), parseInt(((stopProfiler - startProfiler) / 2), 10), "Profiler time " + timeProfiler);
            start();
        }, time);
    }
    */
});

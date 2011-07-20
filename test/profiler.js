test("module message", function() {
    ok(true);
});

pklib.profiler.start("loop_for");

var arr = [];
for(var i = 0; i < 1000000; ++i){
    arr.push(i);
}

pklib.profiler.stop("loop_for");

pklib.profiler.start("loop_for2");
var arr2 = [];
for(var i = 0; i < 1000000; ++i){
    arr2.push(i);
}
pklib.profiler.stop("loop_for2");

var time = pklib.profiler.getTime("loop_for");
var time2 = pklib.profiler.getTime("loop_for2");

console.log("time: " + time + "ms");
console.log("time2: " + time2 + "ms");
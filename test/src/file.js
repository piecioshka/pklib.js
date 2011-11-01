window.addEventListener("load", function () {
    
    module("pklib.file");

    // pklib.file.load
    test("load(check)", function() {

        var value = 1;
        notEqual(pklib.test_data, value, "File contant is unavailable");
        strictEqual(pklib.test_data, undefined, "File content is undefined");
    });

    pklib.file.load("data/data.js", function(file) {
        module("pklib.file");

        test("load(get)", function() {

            var value = 1;
            var url = "data/data.js";

            notEqual(pklib.test_data, undefined, "File content is not undefined");
            strictEqual(pklib.test_data, value, "File contant variable with value: " + value);

            notEqual(file.src.indexOf(url), -1, "File is loaded from url: " + url);
        });
        start();
    });
    
});

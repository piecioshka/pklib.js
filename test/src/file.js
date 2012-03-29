pklib.event.add(window, "load", function () {
    var uriArray = pklib.url.getUri().split("/");
    var PREFIX = "/" + uriArray[1] + "/" + uriArray[2] + "/";
    var DIR = PREFIX + "data/";
    
    module("pklib.file");

    function _test_single_file() {
        pklib.file.loadjs(DIR + "data.js", function(file) {

            module("pklib.file - load single file");

            asyncTest("load", function() {
                var value = 1;
                var url = "data/data.js";
                notEqual(pklib.test_data, undefined, "File content is not undefined");
                strictEqual(pklib.test_data, value, "File contant variable with value: " + value);
                notEqual(file.src.indexOf(url), -1, "File is loaded from url: " + url);
                start();
            });
        });
    }
    function _test_array_files() {
        pklib.file.loadjs([DIR + "data.js", DIR + "data.js"], function(file) {

            module("pklib.file - load array files");

            asyncTest("load", function() {
                var value = 1;
                var url = "data/data.js";
                notEqual(pklib.test_data, undefined, "File content is not undefined");
                strictEqual(pklib.test_data, value, "File contant variable with value: " + value);
                notEqual(file.src.indexOf(url), -1, "File is loaded from url: " + url);
                start();
            });
        });
    }

    _test_single_file();
    _test_array_files();
});

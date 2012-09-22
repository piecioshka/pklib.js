/********************************************************************************/
/* pklib.file TestCase */
/********************************************************************************/

var uriArray = location.pathname.split("/"),
    PREFIX = "/" + uriArray[1] + "/" + uriArray[2] + "/",
    DIR = PREFIX + "data/";

buster.testCase("pklib.file", {
    /*
    "test_single_file": function () {
        pklib.file.loadjs(DIR + "data.js", function (file) {

            module("pklib.file - load single file");

            asyncTest("load", function () {
                var value = 1;
                var url = "data/data.js";
                refute.equals(pklib.test_data, undefined, "File content is not undefined");
                assert.equals(pklib.test_data, value, "File contant variable with value: " + value);
                refute.equals(file.src.indexOf(url), -1, "File is loaded from url: " + url);
                start();
            });
        });
    },

    "test_array_files": function () {
        pklib.file.loadjs([DIR + "data.js", DIR + "data.js"], function (file) {

            module("pklib.file - load array files");

            asyncTest("load", function () {
                var value = 1;
                var url = "data/data.js";
                refute.equals(pklib.test_data, undefined, "File content is not undefined");
                assert.equals(pklib.test_data, value, "File contant variable with value: " + value);
                refute.equals(file.src.indexOf(url), -1, "File is loaded from url: " + url);
                start();
            });
        });
    }
    */
});

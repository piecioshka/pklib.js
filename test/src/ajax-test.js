/********************************************************************************/
/* pklib.ajax TestCase */
/********************************************************************************/

var uriArray = location.pathname.split("/"),
    PREFIX = "/" + uriArray[1] + "/" + uriArray[2] + "/",
    DIR = PREFIX + "data/",
    msg = function (file) {
        return "File: " + file + ", contain good value";
    };

buster.testCase("pklib.ajax", {
    /*
    "test_with_get_simple_plain_text": function () {
        asyncTest("test_with_get_simple_plain_text", function () {
            expect(1);

            pklib.ajax.load({
                url: DIR + "data.txt",
                timeout: 2000,
                done: function (txt) {
                    assert.equals(txt, "1", msg("Data.txt"));
                    start();
                }
            });
        });
    },

    "test_with_get_simple_json_file": function () {
        asyncTest("test_with_get_simple_json_file", function () {
            expect(1);

            pklib.ajax.load({
                url: DIR + "data.json",
                timeout: 2000,
                done: function (json) {
                    json = eval("[" + json + "]")[0];
                    assert.equals(json.data, 1, msg("Data.json"));
                    start();
                }
            });
        });
    },

    "test_with_get_simple_xml": function () {
        asyncTest("test_with_get_simple_xml", function () {
            expect(1);

            pklib.ajax.load({
                url: DIR + "data.xml",
                timeout: 2000,
                done: function (xml) {
                    var child = xml.getElementsByTagName("child")[0],
                        content = child.text || child.textContent;
                    assert.equals(content, "data", msg("Data.xml"));
                    start();
                }
            });
        });
    },

    "test_usage_all_params": function () {
        asyncTest("test_usage_all_params", function () {
            expect(1);

            pklib.ajax.load({
                type: "GET",
                async: false,
                url: "http://localhost",
                timeout: 2000,
                params: {
                    id: 33
                },
                headers: {
                    "Platform": "tv"
                },
                done: function (response) {
                    refute.equals(response.length, 0, "Content length has no 0 size");
                    start();
                }
            });
        });
    },

    "test_stopping_request": function () {
        asyncTest("test_stopping_request", function () {
            expect(2);

            var started = 0,
                xhr = pklib.ajax.load({
                    url: "http://example.org/",
                    timeout: 1,
                    done: function (response) {
                        started = response;
                    }
                });
            pklib.ajax.stop(xhr);

            assert(pklib.object.is_object(xhr), "Create XMLHTTPRequest");
            assert.equals(started, 0, "Request is aborting!");
            start();
        });
    },

    "test_timeout_request": function () {
        test("test_timeout_request", function () {
            expect(1);

            var xhr = pklib.ajax.load({
                url: "http://example.org/",
                timeout: 2000
            });

            assert(pklib.object.is_object(xhr), "Create XMLHTTPRequest");
        });
    },

    "test_error_request": function () {
        asyncTest("test_error_request", function () {
            expect(2);

            var xhr = pklib.ajax.load({
                timeout: 300,
                url: "http://localhost/error/",
                error: function () {
                    assert(pklib.object.is_object(xhr), "Create XMLHTTPRequest");
                    assert("Error request");
                    start();
                }
            });
        });
    },

    "test_undefined_url": function () {
        test("test_undefined_url", function () {
            expect(1);

            try {
                pklib.ajax.load();
            } catch (e) {
                assert.equals(e.toString(), "Error: pklib.ajax.load: undefined request url", "Error request");
            }
        });
    }
    */
});

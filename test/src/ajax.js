pklib.event.add(window, "load", function () {
	
	var DIR = "data/";
	
	function msg(file) {
		return "File: " + file + ", contain good value";
	}
	function _test_txt() {
	    pklib.ajax.load({
	        "url": DIR + "data.txt",
	        "done": function(txt) {

	            module("pklib.ajax");

	            asyncTest("ajax(txt)", function() {
	                strictEqual(txt, "data txt ;-)", msg("Data.txt"));

	                _test_json();

	                start();
	            });
	        }
	    });
	}
	function _test_json() {
        pklib.ajax.load({
            "url": DIR + "data.json",
            "done": function(json) {

                module("pklib.ajax");

                asyncTest("ajax(json)", function() {
                    json = eval("[" + json + "]")[0];
                    strictEqual(json.data, ":)", msg("Data.json"));

                    _test_xml();

                    start();
                });
            }
        });
	}
	function _test_xml () {
		pklib.ajax.load({
            "url": DIR + "data.xml",
            "done": function(xml) {

                module("pklib.ajax");

                asyncTest("ajax(xml)", function() {
                    xml = xml.getElementsByTagName("response")[0];
                    var child = xml.getElementsByTagName("child")[0];
                    strictEqual(child.textContent, "data", msg("Data.xml"));
                });
                start();
            }
        });
	}
	_test_txt();
});

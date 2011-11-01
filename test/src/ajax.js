window.addEventListener("load", function () {

    // pklib.ajax
    pklib.ajax.load({
        "url" : "data/data.txt",
        "done" : function(txt) {

            module("pklib.ajax");

            asyncTest("ajax(txt)", function() {
                strictEqual(txt, "data txt ;-)", "Data.txt is contain good msg");

                pklib.ajax.load({
                    "url" : "data/data.json",
                    "done" : function(json) {

                        module("pklib.ajax");

                        asyncTest("ajax(json)", function() {
                            json = eval("[" + json + "]")[0];
                            strictEqual(json.data, ":)", "Data.json is contain good msg");

                            pklib.ajax.load({
                                "url" : "data/data.xml",
                                "done" : function(xml) {

                                    module("pklib.ajax");

                                    asyncTest("ajax(xml)", function() {
                                        xml = xml.getElementsByTagName("response")[0];
                                        var child = xml.getElementsByTagName("child")[0];
                                        strictEqual(child.textContent, "data", "Data.xml is contain good msg");
                                    });
                                    start();
                                }
                            });

                            start();
                        });
                    }
                });

                start();
            });
        }
    });

});

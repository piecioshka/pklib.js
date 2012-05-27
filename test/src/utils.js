(function (global) {
    "use strict";
    var pklib = global.pklib;

    pklib.event.add(global, "load", function () {
        module("pklib.utils.action");

        test("clearfocus", function() {
            var input = pklib.dom.by_id("input-example-text");
            if (input) {
                pklib.utils.action.clearfocus(input);
            }
        });
        test("outerlink", function() {
            pklib.utils.action.outerlink();
        });
        test("confirm", function() {
            var link = pklib.dom.by_id("confirm-link-example-org");
            if (link) {
                pklib.utils.action.confirm(link);
            }
        });
    });
}(this));

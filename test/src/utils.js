(function (global) {
    "use strict";

    var pklib = global.pklib;

    pklib.event.add(window, "load", function () {

        module("pklib.utils.action");

        test("clearfocus", function() {
            var input = pklib.dom.byId("input-example-text");
            if (input) {
                pklib.utils.action.clearfocus(input);
            }
        });
        test("outerlink", function() {
            pklib.utils.action.outerlink();
        });
        test("confirm", function() {
            var link = pklib.dom.byId("confirm-link-example-org");
            if (link) {
                pklib.utils.action.confirm(link);
            }
        });
    });
}(this));

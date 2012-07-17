(function (global) {
    "use strict";

    pklib.event.add(global, "load", function () {
        module("pklib.url");

        test("get_protocol", function () {
            var pP = pklib.url.get_protocol();
            var dP = document.location.protocol;
            strictEqual(pP, dP, "No diferrence");
        });
        test("get_host", function () {
            var pH = pklib.url.get_host();
            var dH = document.location.host;
            strictEqual(pH, dH, "No diferrence");
        });
        test("get_port", function () {
            var pP = pklib.url.get_port();
            strictEqual(pP, 80, "Port is the same");
        });
        test("get_uri", function () {
            var pU = pklib.url.get_uri();
            var dU = document.location.pathname;
            strictEqual(pU, dU, "No diferrence");
        });
        test("get_params", function () {
            var params = pklib.url.get_params();
            strictEqual(typeof params, "object", "Params always object");
        });
        test("get_param", function () {
            var undefined_param = pklib.url.get_param("undefined");
            strictEqual(undefined_param, null, "Undefined param");
        });
        test("get_hash", function () {
            var pH = pklib.url.get_hash();
            var dH = document.location.hash;
            strictEqual(pH, dH, "No diferrence");
        });
    });

}(this));

(function (global) {
    "use strict";
    var pklib = global.pklib;

    pklib.event.add(global, "load", function () {
        module("pklib.url");

        test("getProtocol", function() {
            var pP = pklib.url.getProtocol();
            var dP = document.location.protocol;
            strictEqual(pP, dP, "No diferrence");
        });
        test("getHost", function() {
            var pH = pklib.url.getHost();
            var dH = document.location.host;
            strictEqual(pH, dH, "No diferrence");
        });
        test("getPort", function() {
            var pP = pklib.url.getPort();
            strictEqual(pP, 80, "Port is the same");
        });
        test("getUri", function() {
            var pU = pklib.url.getUri();
            var dU = document.location.pathname;
            strictEqual(pU, dU, "No diferrence");
        });
        test("getParams", function() {
            var params = pklib.url.getParams();
            strictEqual(typeof params, "object", "Params always object");
        });
        test("getParam", function() {
            var undefined_param = pklib.url.getParam("undefined");
            strictEqual(undefined_param, null, "Undefined param");
        });
        test("getHash", function() {
            var pH = pklib.url.getHash();
            var dH = document.location.hash;
            strictEqual(pH, dH, "No diferrence");
        });
    });
}(this));

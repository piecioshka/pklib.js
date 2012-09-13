(function (global) {
    "use strict";

    module("pklib.cookie");

    test("create", function () {
        var cookie_name = "pklib-test";
        var cookie_data = "pklib";
        var cookie = pklib.cookie.create(cookie_name, cookie_data, 2);
        strictEqual(cookie, cookie_data, "Data in cookie: " + cookie_name + " is OK");
        strictEqual(pklib.cookie.get(cookie_name), cookie_data, "Data in cookie: " + cookie_name + " is OK");
    });

    test("get", function () {
        var cookie_name = "pklib-test";
        var cookie_data = "pklib";
        pklib.cookie.create(cookie_name, cookie_data, 2);
        strictEqual(pklib.cookie.get(cookie_name), cookie_data, "Data in cookie: " + cookie_name + " is OK");
        strictEqual(pklib.cookie.get(), null, "Data undefined don't exists");
    });

    test("remove", function () {
        var cookie_name = "pklib-test";
        var cookie_data = "pklib";
        pklib.cookie.create(cookie_name, cookie_data, 2);
        strictEqual(pklib.cookie.get(cookie_name), cookie_data, "Data in cookie: " + cookie_name + " is OK");
        pklib.cookie.remove(cookie_name);
        notEqual(pklib.cookie.get(cookie_name), cookie_data, "Cookie: " + cookie_name + " don't have data:" + cookie_data);
        strictEqual(pklib.cookie.get(cookie_name), null, "Cookie: " + cookie_name + " is erase");
    });

    test("add ciasteczko loggedMachine", function () {
        var test_cookie_name = "loggedMachine";
        var test_cookie_value = "login:wrjzc1ur;pass:75f76bff1f963facd3ba577302b96064";
        pklib.cookie.create(test_cookie_name, test_cookie_value, 14);
        strictEqual(pklib.cookie.get(test_cookie_name), test_cookie_value, "Identically: " + test_cookie_value);
    });

}(this));

window.addEventListener("load", function () {

    module("pklib.cookie");

    // pklib.cookie.create
    test("create", function() {

        var cookie_name = "pklib-test";
        var cookie_data = "pklib";

        var cookie = pklib.cookie.create(cookie_name, cookie_data, 2);

        strictEqual(cookie, cookie_data, "Data in cookie: " + cookie_name + " is OK");
        strictEqual(pklib.cookie.read(cookie_name), cookie_data, "Data in cookie: " + cookie_name + " is OK");
    });

    // pklib.cookie.read
    test("read", function() {

        var cookie_name = "pklib-test";
        var cookie_data = "pklib";

        pklib.cookie.create(cookie_name, cookie_data, 2);

        strictEqual(pklib.cookie.read(cookie_name), cookie_data, "Data in cookie: " + cookie_name + " is OK");

        strictEqual(pklib.cookie.read(), null, "Data undefined don't exists");
    });

    // pklib.cookie.erase
    test("erase", function() {

        var cookie_name = "pklib-test";
        var cookie_data = "pklib";

        pklib.cookie.create(cookie_name, cookie_data, 2);

        strictEqual(pklib.cookie.read(cookie_name), cookie_data, "Data in cookie: " + cookie_name + " is OK");

        pklib.cookie.erase(cookie_name);

        notEqual(pklib.cookie.read(cookie_name), cookie_data, "Cookie: " + cookie_name + " don't have data:" + cookie_data);
        strictEqual(pklib.cookie.read(cookie_name), undefined, "Cookie: " + cookie_name + " is erase");
    });

});

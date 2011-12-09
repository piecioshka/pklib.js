window.addEventListener("load", function () {
    
    module("pklib.validate");

    // pklib.validate.empty
    test("empty", function() {

        ok(!pklib.validate.empty(undefined), "Empty object: undefined");
        ok(pklib.validate.empty(null), "Empty object: null");
        strictEqual(pklib.validate.empty(false), false, "Empty object: false");
        strictEqual(pklib.validate.empty(true), false, "Empty object: true");
        ok(pklib.validate.empty(0), "Empty object: 0");
        strictEqual(pklib.validate.empty(1), false, "Empty object: 1");
        strictEqual(pklib.validate.empty(2), false, "Empty object: 2");
        ok(pklib.validate.empty(""), "Empty object: ''");
        strictEqual(pklib.validate.empty("asd"), false, "Empty object: 'asd'");
        strictEqual(pklib.validate.empty("0"), false, "Empty object: '0'");
        strictEqual(pklib.validate.empty(function() {
        }), false, "Empty object: function");
        ok(pklib.validate.empty(new function() {
        }), "Empty object: new function");
        ok(pklib.validate.empty([]), "Empty object: []");
        strictEqual(pklib.validate.empty([ 0 ]), false, "Empty object: [0]");
        strictEqual(pklib.validate.empty([ 1 ]), false, "Empty object: [1]");
        strictEqual(pklib.validate.empty([ 2 ]), false, "Empty object: [2]");
        ok(pklib.validate.empty({}), "Empty object: {}");
        strictEqual(pklib.validate.empty({
            "a" : 1
        }), false, "Empty object: {'a':1}");
        strictEqual(pklib.validate.empty({
            2 : []
        }), false, "Empty object: {2: []}");
        strictEqual(pklib.validate.empty({
            0 : []
        }), false, "Empty object: {0: []}");
    });

    // pklib.validate.regexp
    test("regexp", function() {

        try {
            pklib.validate.regexp({});
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Config mustn't empty object");
        }

        try {
            pklib.validate.regexp({
                object : "asd"
            });
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Regexp is mandatory in object");
        }

        try {
            pklib.validate.regexp({
                object : ""
            });
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Regexp is mandatory in object");
        }

        try {
            pklib.validate.regexp({
                regexp : ""
            });
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Object is mandatory in object");
        }

        try {
            pklib.validate.regexp({
                regexp : /[a-z]/
            });
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Object is mandatory in object");
        }

        pklib.validate.regexp({
            error : 0,
            object : "asdasd",
            regexp : /[a-z]/
        });

        pklib.validate.regexp({
            error : {},
            object : "asdasd",
            regexp : /[a-z]/
        });

        pklib.validate.regexp({
            error : [],
            object : "asdasd",
            regexp : /[a-z]/
        });

        pklib.validate.regexp({
            error : function() {
            },
            object : "asdasd",
            regexp : /[a-z]/
        });

        pklib.validate.regexp({
            success : {},
            object : "asdasd",
            regexp : /[a-z]/
        });

        pklib.validate.regexp({
            success : function() {
            },
            object : "asdasd",
            regexp : /[a-z]/
        });

    });

});

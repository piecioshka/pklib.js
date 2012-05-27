(function (global) {
    "use strict";
    var pklib = global.pklib;

    pklib.event.add(global, "load", function () {
        module("pklib.css");

        test("add_class", function() {
            var c = pklib.css;
            var element = document.createElement("span");
            var klass = "active";
            c.add_class(klass, element);
            strictEqual(c.has_class(klass, element), true, "Element has class: " + klass);
            element.className = "active-fix dumny-active";
            c.add_class(klass, element);
            strictEqual(c.has_class(klass, element), true, "Element has class: " + klass);
        });
        test("remove_class", function() {
            var c = pklib.css;
            var element = document.createElement("span");
            var klass = "active";
            element.className = klass + " active-fix dumny-active";
            c.remove_class(klass, element);
            strictEqual(c.has_class(klass, element), false, "Class: " + element.className);
            element.className = klass + "-active-fix dumny-active";
            c.remove_class(klass, element);
            strictEqual(c.has_class(klass, element), false, "Class: " + element.className);
            element.className = "foob" + klass + " active-fix dumny-active";
            c.remove_class(klass, element);
            strictEqual(c.has_class(klass, element), false, "Class: " + element.className);
            element.className = "foo " + klass + " active-fix dumny-active";
            c.remove_class(klass, element);
            strictEqual(c.has_class(klass, element), false, "Class: " + element.className);
        });
        test("has_class", function() {
            var c = pklib.css;
            var element = document.createElement("span");
            var klass = "active";
            element.className = klass;
            strictEqual(c.has_class(klass, element), true, "Element has class: " + klass);
            element.className = klass + " active-foo";
            strictEqual(c.has_class(klass, element), true, "Element has class: " + klass);
            element.className = klass + " active-foo active-bar bar-active foo-active";
            strictEqual(c.has_class(klass, element), true, "Element has class: " + klass);
            element.className = " active-foo active-bar bar-active foo-active";
            strictEqual(c.has_class(klass, element), false, "Element has class: " + klass);
            element.className = klass + "active-foo";
            strictEqual(c.has_class(klass, element), false, "Element has class: " + klass);
            element.className = klass + " foo active-bar";
            strictEqual(c.has_class(klass, element), true, "Element has class: " + klass);
            element.className = "foo " + klass + " foo-active-bar";
            strictEqual(c.has_class(klass, element), true, "Element has class: " + klass);
            element.className = "foo-active " + klass + " foo-active-bar";
            strictEqual(c.has_class(klass, element), true, "Element has class: " + klass);
            element.className = "foo-" + klass + " foo-active-bar";
            strictEqual(c.has_class(klass, element), false, "Element has class: " + klass);
        });
    });
}(this));

pklib.event.add(window, "load", function () {
	
    module("pklib.css");

    test("addClass", function() {
    	var c = pklib.css;
        var element = document.createElement("span");
        var klass = "active";
        c.addClass(klass, element);
        strictEqual(c.hasClass(klass, element), true, "Element has class: " + klass);
        element.className = "active-fix dumny-active";
        c.addClass(klass, element);
        strictEqual(c.hasClass(klass, element), true, "Element has class: " + klass);
    });
    test("removeClass", function() {
    	var c = pklib.css;
        var element = document.createElement("span");
        var klass = "active";
        element.className = klass + " active-fix dumny-active";
        c.removeClass(klass, element);
        strictEqual(c.hasClass(klass, element), false, "Class: " + element.className);
        element.className = klass + "-active-fix dumny-active";
        c.removeClass(klass, element);
        strictEqual(c.hasClass(klass, element), false, "Class: " + element.className);
        element.className = "foob" + klass + " active-fix dumny-active";
        c.removeClass(klass, element);
        strictEqual(c.hasClass(klass, element), false, "Class: " + element.className);
        element.className = "foo " + klass + " active-fix dumny-active";
        c.removeClass(klass, element);
        strictEqual(c.hasClass(klass, element), false, "Class: " + element.className);
    });
    test("hasClass", function() {
    	var c = pklib.css;
        var element = document.createElement("span");
        var klass = "active";
        element.className = klass;
        strictEqual(c.hasClass(klass, element), true, "Element has class: " + klass);
        element.className = klass + " active-foo";
        strictEqual(c.hasClass(klass, element), true, "Element has class: " + klass);
        element.className = klass + " active-foo active-bar bar-active foo-active";
        strictEqual(c.hasClass(klass, element), true, "Element has class: " + klass);
        element.className = " active-foo active-bar bar-active foo-active";
        strictEqual(c.hasClass(klass, element), false, "Element has class: " + klass);
        element.className = klass + "active-foo";
        strictEqual(c.hasClass(klass, element), false, "Element has class: " + klass);
        element.className = klass + " foo active-bar";
        strictEqual(c.hasClass(klass, element), true, "Element has class: " + klass);
        element.className = "foo " + klass + " foo-active-bar";
        strictEqual(c.hasClass(klass, element), true, "Element has class: " + klass);
        element.className = "foo-active " + klass + " foo-active-bar";
        strictEqual(c.hasClass(klass, element), true, "Element has class: " + klass);
        element.className = "foo-" + klass + " foo-active-bar";
        strictEqual(c.hasClass(klass, element), false, "Element has class: " + klass);
    });
});

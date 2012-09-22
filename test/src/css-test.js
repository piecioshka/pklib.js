/********************************************************************************/
/* pklib.css TestCase */
/********************************************************************************/

buster.testCase("pklib.css", {
    "add_class": function () {
        var c = pklib.css,
            element = document.createElement("span"),
            klass = "active";
        c.add_class(klass, element);
        assert.equals(c.has_class(klass, element), true, "Element has class: " + klass);
        element.className = "active-fix dummy-active";
        c.add_class(klass, element);
        assert.equals(c.has_class(klass, element), true, "Element has class: " + klass);
    },

    "remove_class": function () {
        var c = pklib.css,
            element = document.createElement("span"),
            klass = "active";
        element.className = klass + " active-fix dumny-active";
        c.remove_class(klass, element);
        assert.equals(c.has_class(klass, element), false, "Class: " + element.className);
        element.className = klass + "-active-fix dumny-active";
        c.remove_class(klass, element);
        assert.equals(c.has_class(klass, element), false, "Class: " + element.className);
        element.className = "foob" + klass + " active-fix dumny-active";
        c.remove_class(klass, element);
        assert.equals(c.has_class(klass, element), false, "Class: " + element.className);
        element.className = "foo " + klass + " active-fix dumny-active";
        c.remove_class(klass, element);
        assert.equals(c.has_class(klass, element), false, "Class: " + element.className);
    },

    "has_class": function () {
        var c = pklib.css,
            element = document.createElement("span"),
            klass = "active";
        element.className = klass;
        assert.equals(c.has_class(klass, element), true, "Element has class: " + klass);
        element.className = klass + " active-foo";
        assert.equals(c.has_class(klass, element), true, "Element has class: " + klass);
        element.className = klass + " active-foo active-bar bar-active foo-active";
        assert.equals(c.has_class(klass, element), true, "Element has class: " + klass);
        element.className = " active-foo active-bar bar-active foo-active";
        assert.equals(c.has_class(klass, element), false, "Element has class: " + klass);
        element.className = klass + "active-foo";
        assert.equals(c.has_class(klass, element), false, "Element has class: " + klass);
        element.className = klass + " foo active-bar";
        assert.equals(c.has_class(klass, element), true, "Element has class: " + klass);
        element.className = "foo " + klass + " foo-active-bar";
        assert.equals(c.has_class(klass, element), true, "Element has class: " + klass);
        element.className = "foo-active " + klass + " foo-active-bar";
        assert.equals(c.has_class(klass, element), true, "Element has class: " + klass);
        element.className = "foo-" + klass + " foo-active-bar";
        assert.equals(c.has_class(klass, element), false, "Element has class: " + klass);
    }
});

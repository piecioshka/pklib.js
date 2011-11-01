window.addEventListener("load", function () {
    
    module("pklib.css");

    // pklib.css.addClass
    test("addClass", function() {
        var element = document.createElement("span");
        var cssClass = "active";
        pklib.css.addClass(cssClass, element);

        ok(pklib.css.hasClass(cssClass, element), "Element has class: " + cssClass);
    });

    // pklib.css.removeClass
    test("removeClass", function() {

        var element = document.createElement("span");
        var cssClass = "active";
        element.className = cssClass;

        pklib.css.removeClass(cssClass, element);

        ok(pklib.css.hasClass(cssClass, element) === false, "Element has not class: " + cssClass);
    });

    // pklib.css.hasClass
    test("hasClass", function() {

        var element = document.createElement("span");
        var cssClass = "active";
        element.className = cssClass;

        ok(pklib.css.hasClass(element, cssClass), "Element has class: " + cssClass);
    });

});

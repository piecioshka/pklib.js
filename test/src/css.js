pklib.event.add(window, "load", function () {
	
    module("pklib.css");

    test("addClass", function() {
        var element = document.createElement("span");
        var cssClass = "active";
        pklib.css.addClass(cssClass, element);
        strictEqual(pklib.css.hasClass(cssClass, element), true, "Element has class: " + cssClass);
    });
    test("removeClass", function() {
        var element = document.createElement("span");
        var cssClass = "active";
        element.className = cssClass + " active-fix dumny-active";
        pklib.css.removeClass(cssClass, element);
        var cond = pklib.css.hasClass(cssClass, element);
        strictEqual(cond, false, "Element has not class: " + cssClass);
    });
    test("hasClass", function() {
        var element = document.createElement("span");
        var cssClass = "active";
        element.className = cssClass;
        strictEqual(pklib.css.hasClass(cssClass, element), true, "Element has class: " + cssClass);
    });
});

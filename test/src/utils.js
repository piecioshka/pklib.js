pklib.event.add(window, "load", function () {
    
    module("pklib.utils.size");

    test("window", function() {
        var height = pklib.utils.size.window("height");
        ok(height, "Window has height");
        var width = pklib.utils.size.window("width");
        ok(width, "Window has width");
        try {
            pklib.utils.size.window();
        } catch (e) {
            strictEqual(e.constructor, TypeError, "No size defined");
        }
    });
    test("document", function() {
        var height = pklib.utils.size.document("height");
        ok(height, "Document has height");
        var width = pklib.utils.size.document("width");
        ok(width, "Document has width");
        try {
            pklib.utils.size.document();
        } catch (e) {
            strictEqual(e.constructor, TypeError, "No size defined");
        }
    });
    test("object", function() {
        var element = document.createElement("div");
        var height = pklib.utils.size.object(element, "height");
        strictEqual(height, 0, "Object has 0 height");
        var width = pklib.utils.size.object(element, "width");
        strictEqual(width, 0, "Object has 0 width");
        element.innerHTML = "test";
        element.style.position = "absolute";
        element.style.left = "-10000px";
        element.style.top = "-10000px";
        document.body.appendChild(element);
        height = pklib.utils.size.object(element, "height");
        notEqual(height, 0, "Object has " + height + " height");
        width = pklib.utils.size.object(element, "width");
        notEqual(width, 0, "Object has " + width + " width");
        try {
            pklib.utils.size.object();
        } catch (e) {
            strictEqual(e.constructor, TypeError, "No size defined");
        }
        try {
            pklib.utils.size.object(element);
        } catch (e) {
            strictEqual(e.constructor, TypeError, "No size defined");
        }
        pklib.dom.remove(element);
    });

    module("pklib.utils.date");

    test("getFullMonth", function() {
        var month = pklib.utils.date.getFullMonth();
        var dateMonth = new Date().getMonth();
        if (dateMonth <= 9) {
            dateMonth = parseInt(dateMonth, 10) + 1;
            dateMonth = "0" + dateMonth;
        }
        strictEqual(month, dateMonth, "Month is " + month);
    });

    module("pklib.utils.action");

    test("clearfocus", function() {
        // go to Selenium tests
    });
    test("outerlink", function() {
        // go to Selenium tests
    });
    test("confirm", function() {
        // go to Selenium tests
    });

    module("pklib.utils.animate");

    test("scrollTo", function() {
        // go to Selenium tests
    });
});

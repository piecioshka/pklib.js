pklib.event.add(window, "load", function () {
    
    module("pklib.ui.size");

    test("window", function() {
        var height = pklib.ui.size.window("height");
        ok(height, "Window has height");
        var width = pklib.ui.size.window("width");
        ok(width, "Window has width");
        try {
            pklib.ui.size.window();
        } catch (e) {
            strictEqual(e.constructor, TypeError, "No size defined");
        }
    });
    test("document", function() {
        var height = pklib.ui.size.document("height");
        ok(height, "Document has height");
        var width = pklib.ui.size.document("width");
        ok(width, "Document has width");
        try {
            pklib.ui.size.document();
        } catch (e) {
            strictEqual(e.constructor, TypeError, "No size defined");
        }
    });
    test("object", function() {
        var element = document.createElement("div");
        var height = pklib.ui.size.object(element, "height");
        strictEqual(height, 0, "Object has 0 height");
        var width = pklib.ui.size.object(element, "width");
        strictEqual(width, 0, "Object has 0 width");
        element.innerHTML = "test";
        element.style.position = "absolute";
        element.style.left = "-10000px";
        element.style.top = "-10000px";
        document.body.appendChild(element);
        height = pklib.ui.size.object(element, "height");
        notEqual(height, 0, "Object has " + height + " height");
        width = pklib.ui.size.object(element, "width");
        notEqual(width, 0, "Object has " + width + " width");
        try {
            pklib.ui.size.object();
        } catch (e) {
            strictEqual(e.constructor, TypeError, "No size defined");
        }
        try {
            pklib.ui.size.object(element);
        } catch (e) {
            strictEqual(e.constructor, TypeError, "No size defined");
        }
        pklib.dom.remove(element);
    });
    
});
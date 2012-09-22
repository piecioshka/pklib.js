/********************************************************************************/
/* pklib.ui.size TestCase */
/********************************************************************************/

buster.testCase("pklib.ui.size", {
    "window": function () {
        var height = pklib.ui.size.window("height");
        assert(height, "Window has height");
        var width = pklib.ui.size.window("width");
        assert(width, "Window has width");
        try {
            pklib.ui.size.window();
        } catch (e) {
            assert.equals(e.constructor, Error, "No size defined");
        }
    },

    "document": function () {
        var height = pklib.ui.size.document("height");
        assert(height, "Document has height");
        var width = pklib.ui.size.document("width");
        assert(width, "Document has width");
        try {
            pklib.ui.size.document();
        } catch (e) {
            assert.equals(e.constructor, Error, "No size defined");
        }
    },

    "object": function () {
        var element = document.createElement("div");
        var height = pklib.ui.size.object(element, "height");
        assert.equals(height, 0, "Object has 0 height");
        var width = pklib.ui.size.object(element, "width");
        assert.equals(width, 0, "Object has 0 width");
        element.innerHTML = "test";
        element.style.position = "absolute";
        element.style.left = "-10000px";
        element.style.top = "-10000px";
        document.body.appendChild(element);
        height = pklib.ui.size.object(element, "height");
        refute.equals(height, 0, "Object has " + height + " height");
        width = pklib.ui.size.object(element, "width");
        refute.equals(width, 0, "Object has " + width + " width");
        try {
            pklib.ui.size.object();
        } catch (e) {
            assert.equals(e.constructor, Error, "No size defined");
        }
        try {
            pklib.ui.size.object(element);
        } catch (e) {
            assert.equals(e.constructor, Error, "No size defined");
        }
        pklib.dom.remove(element);
    }
});

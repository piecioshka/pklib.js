(function (global) {
    "use strict";

    module("pklib.event");

    test("add", function () {
        var a = null;
        pklib.event.add(global, "test-add-event", function () {
            a = 1;
        });
        strictEqual(a, null, "Window not loaded");
        pklib.event.add(global, "test-add-event", function () {
            strictEqual(a, 1, "Window loaded");
        });
        pklib.event.trigger(global, "test-add-event");
    });
    test("remove", function () {
        var counter = 0;
        var button = document.createElement("button");
        pklib.dom.insert("click", button);
        pklib.dom.insert(button, document.body);
        pklib.event.add(button, "click", function () {
            counter++;
        });
        pklib.event.trigger(button, "click");
        pklib.event.remove(button, "click");
        // pklib.event.trigger(button, "click");
        strictEqual(counter, 1, "Counter it's OK");
        pklib.dom.remove(button);
    });
    test("get", function () {
        var button = document.createElement("button");
        pklib.dom.insert("click", button);
        pklib.dom.insert(button, document.body);
        pklib.event.add(button, "click", function () {});
        var events = pklib.event.get(button, "click");
        strictEqual(Object(events).constructor, Array, "Events are Array");
        strictEqual(events.length, 1, "Event click exists");
        pklib.dom.remove(button);
    });
    test("trigger", function () {
        var counter = 0;
        var button = document.createElement("button");
        pklib.dom.insert("click", button);
        pklib.dom.insert(button, document.body);
        pklib.event.add(button, "click", function () {
            counter++;
        });
        pklib.event.trigger(button, "click");
        strictEqual(counter, 1, "Counter it's OK");
        pklib.dom.remove(button);
    });

}(this));

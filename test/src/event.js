(function (global) {
    "use strict";

    var pklib = global.pklib;

    pklib.event.add(window, "load", function() {

        module("pklib.event");

        test("add", function() {
            var a = null;
            pklib.event.add(window, "load", function() {
                a = 1;
            });
            pklib.event.add(window, "load", function() {
                strictEqual(a, 1, "Window loaded");
            });
        });
        test("remove", function() {
            var counter = 0;
            var button = document.createElement("button");
            pklib.dom.insert("click", button);
            pklib.dom.insert(button, document.body);
            pklib.event.add(button, "click", function() {
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
            pklib.event.add(button, "click", function clickHandler() {
                console.log(new Date);
            });
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
            pklib.event.add(button, "click", function() {
                counter++;
            });
            pklib.event.trigger(button, "click");
            strictEqual(counter, 1, "Counter it's OK");
            pklib.dom.remove(button);
        });
    });
}(this));

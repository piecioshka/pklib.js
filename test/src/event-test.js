/********************************************************************************/
/* pklib.event TestCase */
/********************************************************************************/

buster.testCase("pklib.event", {
    "add": function () {
        var a = null;
        pklib.event.add(window, "test-add-event", function () {
            a = 1;
        });
        assert.equals(a, null, "Window not loaded");
        pklib.event.add(window, "test-add-event", function () {
            assert.equals(a, 1, "Window loaded");
        });
        pklib.event.trigger(window, "test-add-event");
    },

    "remove": function () {
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
        assert.equals(counter, 1, "Counter it's OK");
        pklib.dom.remove(button);
    },

    "get": function () {
        var button = document.createElement("button");
        pklib.dom.insert("click", button);
        pklib.dom.insert(button, document.body);
        pklib.event.add(button, "click", function () {});
        var events = pklib.event.get(button, "click");
        assert.equals(Object(events).constructor, Array, "Events are Array");
        assert.equals(events.length, 1, "Event click exists");
        pklib.dom.remove(button);
    },

    "trigger": function () {
        var counter = 0;
        var button = document.createElement("button");
        pklib.dom.insert("click", button);
        pklib.dom.insert(button, document.body);
        pklib.event.add(button, "click", function () {
            counter++;
        });
        pklib.event.trigger(button, "click");
        assert.equals(counter, 1, "Counter it's OK");
        pklib.dom.remove(button);
    }
});

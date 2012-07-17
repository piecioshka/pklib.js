(function (global) {
    "use strict";

    module("pklib.utils.action");

    function append_created_input_to_body(id) {
        var input = document.createElement("input");
        input.setAttribute("id", id);
        input.setAttribute("type", "text");
        input.setAttribute("value", "example text");
        pklib.dom.insert(input, document.body);
    }

    function append_create_link_to_body(id) {
        var link = document.createElement("a");
        link.setAttribute("id", id);
        link.setAttribute("href", "http://pklib.com/");
        link.setAttribute("rel", "outerlink");
        link.innerHTML = "Example.org";
        pklib.dom.insert(link, document.body);
    }

    test("clearfocus", function () {
        var id = "input-clearfocus";
        append_created_input_to_body(id);

        var input = pklib.dom.by_id(id);
        pklib.utils.action.clearfocus(input);

        pklib.event.trigger(input, "focus");
        strictEqual(input.value, "", "Value is empty string");

        pklib.event.trigger(input, "blur");
        notStrictEqual(input.value, "", "Value is not empty string");

        pklib.dom.remove(input);
    });
    test("outerlink", function () {
        // TODO: Add code what is testing this method!
        expect(0);

        /*
        var id = "link-outerlink";
        append_create_link_to_body(id);

        var link = pklib.dom.by_id(id);

        global.event = {};
        pklib.utils.action.outerlink();

        pklib.event.trigger(link, "click");

        strictEqual(window.location.href, "http://pklib.com/", "Url is good!");

        pklib.dom.remove(link);
        */
    });
    test("confirm", function () {
        // TODO: Add code what is testing this method!
        expect(0);

        /*
        var id = "link-confirm";
        append_create_link_to_body(id);

        var link = pklib.dom.by_id(id);
        pklib.utils.action.confirm(link);

        pklib.event.trigger(link, "click");

        pklib.dom.remove(link);
        */
    });

}(this));

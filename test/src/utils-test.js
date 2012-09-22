/********************************************************************************/
/* pklib.utils TestCase */
/********************************************************************************/

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

buster.testCase("pklib.utils", {
    /*
     "outerlink": function () {
     // TODO
     },

     "confirm": function () {
     // TODO
     },
     */

    "clearfocus": function () {
        var id = "input-clearfocus";
        append_created_input_to_body(id);

        var input = pklib.dom.by_id(id);
        pklib.utils.action.clearfocus(input);

        pklib.event.trigger(input, "focus");
        assert.equals(input.value, "", "Value is empty string");

        pklib.event.trigger(input, "blur");
        refute.equals(input.value, "", "Value is not empty string");

        pklib.dom.remove(input);
    }
});

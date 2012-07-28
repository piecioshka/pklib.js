(function (global) {
    "use strict";

    module("pklib.dom");

    test("is_node", function () {
        expect(0);
        // TODO: write this!
    });

    test("is_node_list", function () {
        var node_list = document.getElementsByTagName("undefined_tag_name");
        ok(pklib.dom.is_node_list(node_list), "Empty NodeList");
        strictEqual(pklib.dom.is_node_list({}), false, "NodeList is undefined");
        strictEqual(pklib.dom.is_node_list(undefined), false, "NodeList is null");
        strictEqual(pklib.dom.is_node_list(), false, "NodeList is null");
    });
    test("is_element", function () {
        var element = document.createElement("span");
        ok(pklib.dom.is_element(element), "Element is node");
        strictEqual(pklib.dom.is_element({}), false, "Element is undefined");
        strictEqual(pklib.dom.is_element(undefined), false, "Element is null");
        strictEqual(pklib.dom.is_element(), false, "Element is null");
    });
    test("is_visible", function () {
        var element = document.createElement("span"),
            child = document.createElement("span");

        child.innerHTML = "0";
        pklib.dom.insert(child, element);
        pklib.dom.insert(element, document.body);

        strictEqual(pklib.dom.is_visible(element), true, "Element %3Cspan%3E is visible");
        element.style.display = "none";
        strictEqual(pklib.dom.is_visible(element), false, "Element %3Cspan%3E is not visible");
        element.style.display = "inline-block";
        strictEqual(pklib.dom.is_visible(element), true, "Element %3Cspan%3E is visible");
        element.style.visibility = "hidden";
        strictEqual(pklib.dom.is_visible(element), false, "Element %3Cspan%3E is not visible");
        element.style.visibility = "visible";
        strictEqual(pklib.dom.is_visible(element), true, "Element %3Cspan%3E is visible");

        pklib.dom.remove(element);
    });
    test("by_id", function () {
        var element = document.createElement("span");
        var id = "pklib-utils-dom-by_id";
        element.id = id;
        pklib.dom.insert(element, document.body);
        strictEqual(pklib.dom.by_id(id), element, "Element about id: " + id + " was found");
        pklib.dom.remove(element);
    });
    test("by_tag", function () {
        var tag = "special-tag";
        var element = document.createElement(tag);
        pklib.dom.insert(element, document.body);
        strictEqual(pklib.dom.by_tag(tag)[0], element, "Element in tag: " + tag + " was found");
        pklib.dom.remove(element);
    });
    test("by_class", function () {
        var cssClass = "uniq-selective-class";
        var element = document.createElement("div");
        pklib.css.add_class(cssClass, element);
        pklib.dom.insert(element, document.body);
        strictEqual(pklib.dom.by_class(cssClass)[0], element, "Element with class: " + cssClass + " was found");
        pklib.dom.remove(element);
    });
    test("index", function () {
        var area = document.createElement("div");
        var element = document.createElement("span");
        var element2 = document.createElement("span");
        area.appendChild(element);
        area.appendChild(element2);
        pklib.dom.insert(area, document.body);
        strictEqual(pklib.dom.index(element2), 1, "Element " + element2.nodeType + " have index 1");
        pklib.dom.remove(area);
    });
    test("children", function () {
        var area = document.createElement("div");
        area.id = "pklib-utils-dom-children";
        var element = document.createElement("span");
        var element2 = document.createElement("span");
        pklib.dom.insert(element, area);
        pklib.dom.insert(element2, area);
        pklib.dom.insert(area, document.body);
        deepEqual(pklib.dom.children(pklib.dom.by_id(area.id)), [ element, element2 ], "Element " + area.nodeType + " have 2 childs");
        pklib.dom.remove(area);
    });
    test("insert", function () {
        var wrapper = document.createElement("div");
        wrapper.style.display = "none";
        pklib.dom.insert(wrapper, document.body);
        var div = document.createElement("div");
        pklib.dom.insert(div, wrapper);
        pklib.dom.insert("asd", div);
        var childs = pklib.dom.children(wrapper);
        strictEqual(childs.length, 1, "Wrapper has only one childs, that's right!");
        strictEqual(div.innerHTML, "asd", "Message's right!");
        pklib.dom.remove(wrapper);
    });
    test("remove", function () {
        var element = document.createElement("div");
        element.id = "zaq12wsx";
        pklib.dom.insert(element, document.body);
        strictEqual(pklib.dom.by_id("zaq12wsx"), element, "Object create!");
        pklib.dom.remove(element);
        strictEqual(pklib.dom.by_id("zaq12wsx"), null, "Object not exists!");
    });
    test("prev", function () {
        var a = document.createElement("div");
        a.id = "pklib-dom-prev-a";
        pklib.dom.insert(a, document.body);
        var b = document.createElement("div");
        b.id = "pklib-dom-prev-b";
        pklib.dom.insert(b, document.body);
        var prev = pklib.dom.prev(b);
        strictEqual(prev, a, "Previous element is OK");
        pklib.dom.remove(a, b);
    });
    test("next", function () {
        var c = document.createElement("div");
        c.id = "pklib-dom-next-c";
        pklib.dom.insert(c, document.body);
        var d = document.createElement("div");
        d.id = "pklib-dom-next-d";
        pklib.dom.insert(d, document.body);
        var next = pklib.dom.next(c);
        strictEqual(next, d, "Next element is OK");
        pklib.dom.remove(c, d);
    });
    test("parent", function () {
        var wrapper = document.createElement("div");
        pklib.dom.insert(wrapper, document.body);
        var div = document.createElement("div");
        pklib.dom.insert(div, wrapper);
        strictEqual(pklib.dom.parent(div), wrapper, "Parent it's OK");
        pklib.dom.remove(wrapper, div);
    });

}(this));

window.addEventListener("load", function () {

    module("pklib.dom");

    // pklib.dom.isNode
    test("isNode", function() {

        var element = document.createElement("span");
        document.body.appendChild(element);

        ok(pklib.dom.isNode(element), "Element is node");

        strictEqual(pklib.dom.isNode({}), null, "Element is undefined");
        strictEqual(pklib.dom.isNode(undefined), null, "Element is null");
        strictEqual(pklib.dom.isNode(), null, "Element is null");
    });

    // pklib.dom.byId
    test("byId", function() {

        var element = document.createElement("span");
        var id = "pklib-utils-dom-byId";
        element.id = id;

        document.body.appendChild(element);

        strictEqual(pklib.dom.byId(id), element, "Element about id: " + id + " was found");
    });

    // pklib.dom.byTag
    test("byTag", function() {

        var tag = "special-tag";
        var element = document.createElement(tag);

        document.body.appendChild(element);

        strictEqual(pklib.dom.byTag(tag)[0], element, "Element in tag: " + tag + " was found");
    });

    // pklib.dom.byClass
    test("byClass", function() {

        var cssClass = "uniq-selective-class";
        var element = document.createElement("div");
        pklib.css.addClass(cssClass, element);

        document.body.appendChild(element);
                
        strictEqual(pklib.dom.byClass(cssClass)[0], element, "Element with class: " + cssClass + " was found");
    });

    // pklib.dom.get
    test("get", function() {

        var wrapper = document.createElement("div");
        pklib.css.addClass("dummy", wrapper);

        var link1 = document.createElement("a");
        link1.innerHTML = 1;
        wrapper.appendChild(link1);

        var link2 = document.createElement("a");
        link2.innerHTML = 2;
        wrapper.appendChild(link2);

        document.body.appendChild(wrapper);

        log(pklib.dom.get(".dummy a"));
    });

    // pklib.dom.index
    test("index", function() {

        var area = document.createElement("div");
        var element = document.createElement("span");
        var element2 = document.createElement("span");

        area.appendChild(element);
        area.appendChild(element2);

        document.body.appendChild(area);

        strictEqual(pklib.dom.index(element2), 1, "Element " + element2.nodeType + " have index 1");
    });

    // pklib.dom.children
    test("children", function() {

        var area = document.createElement("div");
        area.id = "pklib-utils-dom-children";
        var element = document.createElement("span");
        var element2 = document.createElement("span");

        area.appendChild(element);
        area.appendChild(element2);

        document.body.appendChild(area);

        deepEqual(pklib.dom.children(pklib.dom.byId(area.id)), [ element, element2 ], "Element " + area.nodeType + " have 2 childs");
    });

    // pklib.dom.center
    test("center", function() {

        var element = document.createElement("div");
        element.id = "pklib-utils-dom-center";

        document.body.appendChild(element);

        var __center = pklib.dom.center(pklib.dom.byId(element.id));

        ok(pklib.array.isArray(__center), "Params are in array");
        strictEqual(__center.length, 2, "Two params");
    });

});

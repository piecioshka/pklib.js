/**
 * Test file Use Qunit Test Framework
 */

pklib.tests = function() {

    module("pklib.borwser");

    // pklib.browser.getName
    test("getName", function() {

        var name = pklib.browser.getName();
        ok(name, "Browser name: " + name);
        ok(pklib.string.isString(name), "Browser name is string");
    });

    // pklib.browser.getVersion
    test("getVersion", function() {

        var version = pklib.browser.getVersion();
        ok(version, "Browser version: " + version);
        ok(pklib.string.isString(version), "Browser version is string");
    });

    /** *********************************************************************** */

    module("pklib.css");

    // pklib.css.addClass
    test("addClass", function() {
        var element = document.createElement("span");
        var cssClass = "active";
        pklib.css.addClass(cssClass, element);

        ok(pklib.css.hasClass(cssClass, element), "Element has class: " + cssClass);
    });

    // pklib.css.removeClass
    test("removeClass", function() {

        var element = document.createElement("span");
        var cssClass = "active";
        element.className = cssClass;

        pklib.css.removeClass(cssClass, element);

        ok(pklib.css.hasClass(cssClass, element) === false, "Element has not class: " + cssClass);
    });

    // pklib.css.hasClass
    test("hasClass", function() {

        var element = document.createElement("span");
        var cssClass = "active";
        element.className = cssClass;

        ok(pklib.css.hasClass(element, cssClass), "Element has class: " + cssClass);
    });

    module("pklib.dom");

    // pklib.dom.isNode
    test("isNode", function() {

        var element = document.createElement("span");
        document.body.appendChild(element);

        strictEqual(pklib.dom.isNode(element), pklib.dom.nodeTypes[1], "Element is node");

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

    module("pklib.array");

    // pklib.array.isArray
    test("isArray", function() {

        var element = document.createElement("div");
        element.id = "pklib-utils-dom-center";

        document.body.appendChild(element);

        var __center = pklib.dom.center(pklib.dom.byId(element.id));

        ok(pklib.array.isArray(__center), "Params are in array");
        strictEqual(__center.length, 2, "Two params");
    });

    // pklib.array.inArray
    test("inArray", function() {

        var __array = [];
        var element = 3;

        __array.push(element);

        ok(pklib.array.inArray(element, __array), "Element is in array");
    });

    // pklib.array.unique
    test("unique", function() {

        var __arrayRedundancy = [ 2, 3, 4, 2, 3, 4 ];
        var __array = [ 2, 3, 4 ];
        var __temp = pklib.array.unique(__arrayRedundancy);

        deepEqual(__temp, __array, "Array with unique elements");
    });

    // pklib.array.remove
    test("remove", function() {

        var __array = [ 1 ];
        var __temp = [ 1 ];
        var element = 3;
        var element2 = 4;

        __array.push(element);
        __array.push(element2);

        pklib.array.remove(__array, element);
        pklib.array.remove(__array, element2);

        deepEqual(__array, __temp, "Elements in array removed");
    });

    module("pklib.event");

    // pklib.event.add
    test("add", function() {

        var element = document.createElement("a");
        document.body.appendChild(element);

        var type = "click";
        var event = pklib.event.add(element, type, function() {
            alert(1);
        });

        strictEqual(event.constructor, Event, "Event is add");
        strictEqual(event.type, type, "Type event is: " + type);
    });

    // pklib.event.remove
    test("remove", function() {

        var element = document.createElement("a");
        document.body.appendChild(element);

        var type = "click";
        var event = pklib.event.add(element, type, function() {
            alert(1);
        });

        strictEqual(event.constructor, Event, "Event is add");
        strictEqual(event.type, type, "Type event is: " + type);

        var removed = pklib.event.remove(element, type, function() {
            alert(1);
        });

        ok(removed, "Event was removed");

    });

    module("pklib.utils.size");

    // pklib.utils.size.window
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

    // pklib.utils.size.document
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

    // pklib.utils.size.object
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
    });

    module("pklib.utils.date");

    // pklib.utils.date.getFullMonth
    test("getFullMonth", function() {

        var month = pklib.utils.date.getFullMonth();

        var dateMonth = new Date().getMonth();
        if (dateMonth < 9) {
            dateMonth = "0" + (dateMonth + 1);
        }

        strictEqual(month, dateMonth, "Month is " + month);
    });

    module("pklib.string");

    // pklib.string.isString
    test("isString", function() {

        var source = 45345;
        notEqual(pklib.string.isString(source), true, "Is not string");

        source = "asdasd";
        ok(pklib.string.isString(source), "Is string");

        source = "as345345345dasd";
        ok(pklib.string.isString(source), "Is string");

        source = [];
        notEqual(pklib.string.isString(source), true, "Is not string");

        source = {
            3 : 4
        };
        notEqual(pklib.string.isString(source), true, "Is not string");

        source = [ "a" ];
        notEqual(pklib.string.isString(source), true, "Is not string");

        source = function() {
            return this;
        };
        notEqual(pklib.string.isString(source), true, "Is not string");
    });

    // pklib.string.isLetter
    test("isLetter", function() {

        var source = 45345;
        notEqual(pklib.string.isLetter(source), true, "Is not letter");

        source = "2";
        notEqual(pklib.string.isLetter(source), true, "Is not letter");

        source = "G";
        strictEqual(pklib.string.isLetter(source), true, "Is letter");

        source = 5;
        notEqual(pklib.string.isLetter(source), true, "Is not letter");

        source = [];
        notEqual(pklib.string.isLetter(source), true, "Is not letter");

        source = {
            3 : 4
        };
        notEqual(pklib.string.isLetter(source), true, "Is not letter");

        source = [ "a" ];
        notEqual(pklib.string.isLetter(source), true, "Is not letter");

        source = function() {
            return this;
        };
        notEqual(pklib.string.isLetter(source), true, "Is not letter");
    });

    // pklib.string.trim
    test("trim", function() {

        var result = "dog";

        var text = "" +
        		"dog   ";
        strictEqual(pklib.string.trim(text), result, "1) trim is good for: " + text);

        text = "    dog ";
        strictEqual(pklib.string.trim(text), result, "2) trim is good for: " + text);

        text = " dog ";
        strictEqual(pklib.string.trim(text), result, "3) trim is good for: " + text);

        text = "dog";
        strictEqual(pklib.string.trim(text), result, "4) trim is good for: " + text);

        text = " \ndog ";
        strictEqual(pklib.string.trim(text), result, "5) trim is good for: " + text);

        text = " \tdog ";
        strictEqual(pklib.string.trim(text), result, "6) trim is good for: " + text);
    });

    // pklib.string.slug
    test("slug", function() {

        var text = "Chrząszcz brzmię w Żółwiu";
        var result = "chrzaszcz-brzmie-w-zolwiu";
        strictEqual(pklib.string.slug(text), result, "Slug is good for: " + text);

        var text = "Ch?$%^?4564565rząszcz brzmię w +Żółwiu";
        var result = "ch4564565rzaszcz-brzmie-w-zolwiu";
        strictEqual(pklib.string.slug(text), result, "Slug is good for: " + text);
    });

    // pklib.string.capitalize
    test("capitalize", function() {

        var text = "dziewczYnka z zapaŁeczkami W doMku sobie Miaszkała ;)";
        var result = "Dziewczynka z zapałeczkami w domku sobie miaszkała ;)";

        strictEqual(pklib.string.capitalize(text), result, "Capitalize is good for: " + text);

        text = "test-test";
        result = "Test-test";

        strictEqual(pklib.string.capitalize(text), result, "Capitalize is good for: " + text);
    });

    // pklib.string.delimiterSeparatedWords
    test("delimiterSeparatedWords", function() {

        var text = "dziewczYnkazzapaŁeczkamiWdoMkusFobieMiaszkała ;)";
        var result = "dziewcz-ynkazzapa-łeczkami-wdo-mkus-fobie-miaszkała ;)";

        strictEqual(pklib.string.delimiterSeparatedWords(text), result, "delimiterSeparatedWords is good for: " + text);

        var text = "testTest";
        var result = "test-test";

        strictEqual(pklib.string.delimiterSeparatedWords(text), result, "delimiterSeparatedWords is good for: " + text);
    });

    // pklib.string.camelCase
    test("camelCase", function() {

        var text = "Dziewczynka-z-zapa-łe-czkami-";
        var result = "DziewczynkaZZapaŁeCzkami";

        strictEqual(pklib.string.camelCase(text), result, "Camel case is good for: " + text);

        text = "test-test";
        result = "testTest";

        strictEqual(pklib.string.camelCase(text), result, "Camel case is good for: " + text);
    });

    // pklib.string.slice
    test("slice", function() {

        var text = "Ciechocinek";
        var result = "Cie...";

        strictEqual(pklib.string.slice(text, 3), result, "Slice is good for: " + text);

        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam viverra tincidunt semper.";
        result = "Lorem ipsum dolor si...";

        strictEqual(pklib.string.slice(text, 20), result, "Slice is good for: " + text);
    });

    module("pklib.utils");

    // pklib.utils.merge
    test("merge", function() {

        var __array1 = [ 1, 2, 3 ];
        var __array2 = [ 4, "a", 0 ];

        var __arrayMerge = [ 0, 1, 2, 3, 4, "a" ];

        deepEqual(pklib.utils.merge(__array1, __array2), __arrayMerge, "Merge array are OK");

        var __object1 = {
            test : 2,
            dummny : [ 2 ]
        };
        var __object2 = {
            test2 : 2345,
            dummny2 : [ 561235 ]
        };

        var __objectMerge = {
            test : 2,
            test2 : 2345,
            dummny : [ 2 ],
            dummny2 : [ 561235 ]
        };

        deepEqual(pklib.utils.merge(__object1, __object2), __objectMerge, "Merge object are OK");
    });

    module("pklib.utils.action");

    // pklib.utils.action.clearfocus
    test("clearfocus", function() {
        // go to Selenium tests
    });

    // pklib.utils.action.outerlink
    test("outerlink", function() {
        // go to Selenium tests
    });

    // pklib.utils.action.confirm
    test("confirm", function() {
        // go to Selenium tests
    });

    module("pklib.utils.animate");

    // pklib.utils.animate.scrollTo
    test("scrollTo", function() {
        // go to Selenium tests
    });

    /** *********************************************************************** */

    // pklib.ajax
    pklib.ajax.load({
        "url" : "data/data.txt",
        "done" : function(txt) {

            module("pklib.ajax");

            asyncTest("ajax(txt)", function() {
                strictEqual(txt, "data txt ;-)", "Data.txt is contain good msg");

                pklib.ajax.load({
                    "url" : "data/data.json",
                    "done" : function(json) {

                        module("pklib.ajax");

                        asyncTest("ajax(json)", function() {
                            json = eval("[" + json + "]")[0];
                            strictEqual(json.data, ":)", "Data.json is contain good msg");

                            pklib.ajax.load({
                                "url" : "data/data.xml",
                                "done" : function(xml) {

                                    module("pklib.ajax");

                                    asyncTest("ajax(xml)", function() {
                                        xml = xml.getElementsByTagName("response")[0];
                                        var child = xml.getElementsByTagName("child")[0];
                                        strictEqual(child.textContent, "data", "Data.xml is contain good msg");
                                    });
                                    start();
                                }
                            });

                            start();
                        });
                    }
                });

                start();
            });
        }
    });

    /** *********************************************************************** */

    module("pklib.cookie");

    // pklib.cookie.create
    test("create", function() {

        var cookie_name = "pklib-test";
        var cookie_data = "pklib";

        var cookie = pklib.cookie.create(cookie_name, cookie_data, 2);

        strictEqual(cookie, cookie_data, "Data in cookie: " + cookie_name + " is OK");
        strictEqual(pklib.cookie.read(cookie_name), cookie_data, "Data in cookie: " + cookie_name + " is OK");
    });

    // pklib.cookie.read
    test("read", function() {

        var cookie_name = "pklib-test";
        var cookie_data = "pklib";

        pklib.cookie.create(cookie_name, cookie_data, 2);

        strictEqual(pklib.cookie.read(cookie_name), cookie_data, "Data in cookie: " + cookie_name + " is OK");

        strictEqual(pklib.cookie.read(), null, "Data undefined don't exists");
    });

    // pklib.cookie.erase
    test("erase", function() {

        var cookie_name = "pklib-test";
        var cookie_data = "pklib";

        pklib.cookie.create(cookie_name, cookie_data, 2);

        strictEqual(pklib.cookie.read(cookie_name), cookie_data, "Data in cookie: " + cookie_name + " is OK");

        pklib.cookie.erase(cookie_name);

        notEqual(pklib.cookie.read(cookie_name), cookie_data, "Cookie: " + cookie_name + " don't have data:" + cookie_data);
        strictEqual(pklib.cookie.read(cookie_name), undefined, "Cookie: " + cookie_name + " is erase");
    });

    /** *********************************************************************** */

    module("pklib.file");

    // pklib.file.load
    test("load(check)", function() {

        var value = 1;
        notEqual(pklib.test_data, value, "File contant is unavailable");
        strictEqual(pklib.test_data, undefined, "File content is undefined");
    });

    pklib.file.load("data/data.js", function(file) {
        module("pklib.file");

        test("load(get)", function() {

            var value = 1;
            var url = "data/data.js";

            notEqual(pklib.test_data, undefined, "File content is not undefined");
            strictEqual(pklib.test_data, value, "File contant variable with value: " + value);

            notEqual(file.src.indexOf(url), -1, "File is loaded from url: " + url);
        });
        start();
    });

    /** *********************************************************************** */

    module("pklib.json");

    // pklib.json.stringify
    test("stringify", function() {

        var __array = [ 2, 3 ];

        var test = pklib.json.stringify(__array);
        var result = "[\n\t2,\n\t3\n]";

        strictEqual(test, result, "Array is made to string");

        test = pklib.json.stringify(__array, 3);
        result = "[\n\t\t\t\t\t\t\t2,\n\t\t\t\t3\n\t\t\t]";

        strictEqual(test, result, "Array with indent is made to string");

        strictEqual(pklib.json.stringify(), undefined, "Object is undefined");

        strictEqual(pklib.json.stringify(undefined), undefined, "Object is undefined");

        strictEqual(pklib.json.stringify(null), null, "Object is null");
    });

    // pklib.json.serialize
    test("serialize", function() {

        var __object = {
            "kaczuszka" : [ "k", 4 ]
        };

        var test = pklib.json.serialize(__object);
        var result = "kaczuszka=k,4";

        strictEqual(test, result, "Object is made to string");

        test = pklib.json.serialize(__object, true);
        result = '{kaczuszka:"k,4"}';
        strictEqual(test, result, "Object is made to string");

        try {
            pklib.json.serialize();
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Object is made to string");
        }

        try {
            pklib.json.serialize();
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Object is undefined");
        }

        try {
            pklib.json.serialize(undefined);
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Object is undefined");
        }

        try {
            pklib.json.serialize(null);
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Object is null");
        }

    });

    /** *********************************************************************** */

    module("pklib.profiler");

    // pklib.profiler.start
    test("start", function() {

        var startProfiler = pklib.profiler.start();

        strictEqual(typeof startProfiler, "object", "Profiler start time type is number");
        strictEqual(startProfiler.toString(), (new Date()).toString(), "Profiler start about: " + startProfiler);
    });

    // pklib.profiler.stop
    test("stop", function() {

        var stopProfiler = pklib.profiler.stop();

        strictEqual(typeof stopProfiler, "object", "Profiler stop time type is number");
        strictEqual(stopProfiler.toString(), (new Date()).toString(), "Profiler stop about: " + stopProfiler);
    });

    // pklib.profiler.getTime
    asyncTest("getTime", function() {

        var startProfiler = pklib.profiler.start("test");
        var time = 13;

        setTimeout(function() {
            var stopProfiler = pklib.profiler.stop("test");
            var timeProfiler = pklib.profiler.getTime("test");
            strictEqual(typeof timeProfiler, "number", "Profiler time type is number");
            strictEqual(timeProfiler, (stopProfiler - startProfiler) / 2, "Profiler time " + timeProfiler);
            start();
        }, time);

    });

    /** *********************************************************************** */

    module("pklib.validate");

    // pklib.validate.empty
    test("empty", function() {

        ok(pklib.validate.empty(undefined), "Empty object: undefined");
        ok(pklib.validate.empty(null), "Empty object: null");
        strictEqual(pklib.validate.empty(false), false, "Empty object: false");
        strictEqual(pklib.validate.empty(true), false, "Empty object: true");
        ok(pklib.validate.empty(0), "Empty object: 0");
        strictEqual(pklib.validate.empty(1), false, "Empty object: 1");
        strictEqual(pklib.validate.empty(2), false, "Empty object: 2");
        ok(pklib.validate.empty(""), "Empty object: ''");
        strictEqual(pklib.validate.empty("asd"), false, "Empty object: 'asd'");
        strictEqual(pklib.validate.empty("0"), false, "Empty object: '0'");
        strictEqual(pklib.validate.empty(function() {
        }), false, "Empty object: function");
        ok(pklib.validate.empty(new function() {
        }), "Empty object: new function");
        ok(pklib.validate.empty([]), "Empty object: []");
        strictEqual(pklib.validate.empty([ 0 ]), false, "Empty object: [0]");
        strictEqual(pklib.validate.empty([ 1 ]), false, "Empty object: [1]");
        strictEqual(pklib.validate.empty([ 2 ]), false, "Empty object: [2]");
        ok(pklib.validate.empty({}), "Empty object: {}");
        strictEqual(pklib.validate.empty({
            "a" : 1
        }), false, "Empty object: {'a':1}");
        strictEqual(pklib.validate.empty({
            2 : []
        }), false, "Empty object: {2: []}");
        strictEqual(pklib.validate.empty({
            0 : []
        }), false, "Empty object: {0: []}");
    });

    // pklib.validate.regexp
    test("regexp", function() {

        try {
            pklib.validate.regexp({});
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Config mustn't empty object");
        }

        try {
            pklib.validate.regexp({
                object : "asd"
            });
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Regexp is mandatory in object");
        }

        try {
            pklib.validate.regexp({
                object : ""
            });
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Regexp is mandatory in object");
        }

        try {
            pklib.validate.regexp({
                regexp : ""
            });
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Object is mandatory in object");
        }

        try {
            pklib.validate.regexp({
                regexp : /[a-z]/
            });
        } catch (e) {
            strictEqual(e.constructor, TypeError, "Object is mandatory in object");
        }

        pklib.validate.regexp({
            error : 0,
            object : "asdasd",
            regexp : /[a-z]/
        });

        pklib.validate.regexp({
            error : {},
            object : "asdasd",
            regexp : /[a-z]/
        });

        pklib.validate.regexp({
            error : [],
            object : "asdasd",
            regexp : /[a-z]/
        });

        pklib.validate.regexp({
            error : function() {
            },
            object : "asdasd",
            regexp : /[a-z]/
        });

        pklib.validate.regexp({
            success : {},
            object : "asdasd",
            regexp : /[a-z]/
        });

        pklib.validate.regexp({
            success : function() {
            },
            object : "asdasd",
            regexp : /[a-z]/
        });

    });

};

pklib.event.add(window, "load", pklib.tests);

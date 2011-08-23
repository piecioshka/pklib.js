/**
 * Test file Use Qunit Test Framework
 */

pklib.utils.event.add(window, "load", function() {

module("pklib.borwser");

// pklib.browser.getName
test("getName", function() {

    var name = pklib.browser.getName();
    ok(name, "Browser name: " + name);
    ok(pklib.utils.string.isString(name), "Browser name is string");
});

// pklib.browser.getVersion
test("getVersion", function() {

    var version = pklib.browser.getVersion();
    ok(version, "Browser version: " + version);
    ok(pklib.utils.string.isString(version), "Browser version is string");
});

module("pklib.utils.css");

// pklib.utils.css.addClass
test("addClass", function() {
    var element = document.createElement("span");
    var cssClass = "active";
    pklib.utils.css.addClass(element, cssClass);

    ok(pklib.utils.css.hasClass(element, cssClass), "Element has class: " + cssClass);
});

// pklib.utils.css.removeClass
test("removeClass", function() {

    var element = document.createElement("span");
    var cssClass = "active";
    element.className = cssClass;

    pklib.utils.css.removeClass(element, cssClass);

    ok(pklib.utils.css.hasClass(element, cssClass) === false, "Element has not class: " + cssClass);
});

// pklib.utils.css.hasClass
test("hasClass", function() {

    var element = document.createElement("span");
    var cssClass = "active";
    element.className = cssClass;

    ok(pklib.utils.css.hasClass(element, cssClass), "Element has class: " + cssClass);
});

module("pklib.utils.dom");

// pklib.utils.dom.isNode
test("isNode", function() {

    var element = document.createElement("span");
    document.body.appendChild(element);

    strictEqual(pklib.utils.dom.isNode(element), pklib.utils.dom.nodeTypes[1], "Element is node");

    strictEqual(pklib.utils.dom.isNode({}), undefined, "Element is node");
});

// pklib.utils.dom.byId
test("byId", function() {

    var element = document.createElement("span");
    var id = "pklib-utils-dom-byId";
    element.id = id;

    document.body.appendChild(element);

    strictEqual(pklib.utils.dom.byId(id), element, "Element about id: " + id + " was found");
});

// pklib.utils.dom.byTag
test("byTag", function() {

    var tag = "special-tag";
    var element = document.createElement(tag);

    document.body.appendChild(element);

    strictEqual(pklib.utils.dom.byTag(tag)[0], element, "Element in tag: " + tag + " was found");
});

// pklib.utils.dom.index
test("index", function() {

    var area = document.createElement("div");
    var element = document.createElement("span");
    var element2 = document.createElement("span");

    area.appendChild(element);
    area.appendChild(element2);

    document.body.appendChild(area);

    strictEqual(pklib.utils.dom.index(element2), 1, "Element " + element2.nodeType + " have index 1");
});

// pklib.utils.dom.children
test("children", function() {

    var area = document.createElement("div");
    area.id = "pklib-utils-dom-children";
    var element = document.createElement("span");
    var element2 = document.createElement("span");

    area.appendChild(element);
    area.appendChild(element2);

    document.body.appendChild(area);

    deepEqual(pklib.utils.dom.children(pklib.utils.dom.byId(area.id)), [ element, element2 ], "Element " + area.nodeType + " have 2 childs");
});

// pklib.utils.dom.center
test("center", function() {

    var element = document.createElement("div");
    element.id = "pklib-utils-dom-center";

    document.body.appendChild(element);

    var __center = pklib.utils.dom.center(pklib.utils.dom.byId(element.id));

    ok(pklib.utils.array.isArray(__center), "Params are in array");
    strictEqual(__center.length, 2, "Two params");
});

module("pklib.utils.array");

// pklib.utils.array.isArray
test("isArray", function() {

    var element = document.createElement("div");
    element.id = "pklib-utils-dom-center";

    document.body.appendChild(element);

    var __center = pklib.utils.dom.center(pklib.utils.dom.byId(element.id));

    ok(pklib.utils.array.isArray(__center), "Params are in array");
    strictEqual(__center.length, 2, "Two params");
});

// pklib.utils.array.inArray
test("inArray", function() {

    var __array = [];
    var element = 3;

    __array.push(element);

    ok(pklib.utils.array.inArray(__array, element) !== false, "Element is in array");
    strictEqual(pklib.utils.array.inArray(__array, element), 0, "Element is on first position in array");
});

// pklib.utils.array.unique
test("unique", function() {

    var __arrayRedundancy = [ 2, 3, 4, 2, 3, 4 ];
    var __array = [ 2, 3, 4 ];
    var __temp = pklib.utils.array.unique(__arrayRedundancy);

    deepEqual(__temp, __array, "Array with unique elements");
});

// pklib.utils.array.remove
test("remove", function() {

    var __array = [ 1 ];
    var __temp = [ 1 ];
    var element = 3;
    var element2 = 4;

    __array.push(element);
    __array.push(element2);

    pklib.utils.array.remove(__array, element);
    pklib.utils.array.remove(__array, element2);

    deepEqual(__array, __temp, "Elements in array removed");
});

module("pklib.utils.event");

// pklib.utils.event.add
test("add", function() {

    var element = document.createElement("a");
    document.body.appendChild(element);

    var type = "click";
    var event = pklib.utils.event.add(element, type, function() {
        alert(1);
    });

    strictEqual(event.constructor, Event, "Event is add");
    strictEqual(event.type, type, "Type event is: " + type);
});

// pklib.utils.event.remove
test("remove", function() {

    var element = document.createElement("a");
    document.body.appendChild(element);

    var type = "click";
    var event = pklib.utils.event.add(element, type, function() {
        alert(1);
    });

    strictEqual(event.constructor, Event, "Event is add");
    strictEqual(event.type, type, "Type event is: " + type);

    var removed = pklib.utils.event.remove(element, type, function() {
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
        equal(e.constructor, TypeError, "No size defined");
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
        equal(e.constructor, TypeError, "No size defined");
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
        equal(e.constructor, TypeError, "No size defined");
    }

    try {
        pklib.utils.size.object(element);
    } catch (e) {
        equal(e.constructor, TypeError, "No size defined");
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

module("pklib.utils.string");

// pklib.utils.string.isString
test("isString", function() {

    var source = 45345;
    notEqual(pklib.utils.string.isString(source), true, "Is not string");

    source = "asdasd";
    ok(pklib.utils.string.isString(source), "Is string");

    source = "as345345345dasd";
    ok(pklib.utils.string.isString(source), "Is string");

    source = [];
    notEqual(pklib.utils.string.isString(source), true, "Is not string");

    source = {
        3 : 4
    };
    notEqual(pklib.utils.string.isString(source), true, "Is not string");

    source = [ "a" ];
    notEqual(pklib.utils.string.isString(source), true, "Is not string");

    source = function() {
        return this;
    };
    notEqual(pklib.utils.string.isString(source), true, "Is not string");
});

// pklib.utils.string.isLetter
test("isLetter", function() {

    var source = 45345;
    notEqual(pklib.utils.string.isLetter(source), true, "Is not letter");

    source = "2";
    notEqual(pklib.utils.string.isLetter(source), true, "Is not letter");

    source = "G";
    strictEqual(pklib.utils.string.isLetter(source), true, "Is letter");

    source = 5;
    notEqual(pklib.utils.string.isLetter(source), true, "Is not letter");

    source = [];
    notEqual(pklib.utils.string.isLetter(source), true, "Is not letter");

    source = {
        3 : 4
    };
    notEqual(pklib.utils.string.isLetter(source), true, "Is not letter");

    source = [ "a" ];
    notEqual(pklib.utils.string.isLetter(source), true, "Is not letter");

    source = function() {
        return this;
    };
    notEqual(pklib.utils.string.isLetter(source), true, "Is not letter");
});

// pklib.utils.string.ltrim
test("ltrim", function() {

    var result = "dog";

    var text = "   _-dog";
    strictEqual(pklib.utils.string.ltrim(text), result, "Left trim is good for: " + text);

    text = "-___ dog";
    strictEqual(pklib.utils.string.ltrim(text), result, "Left trim is good for: " + text);

    text = " _      dog";
    strictEqual(pklib.utils.string.ltrim(text), result, "Left trim is good for: " + text);

    text = " _      $dog";

    var chars = pklib.utils.string.chars;
    pklib.utils.string.chars.push("$");
    strictEqual(pklib.utils.string.ltrim(text), result, "Left trim is good for: " + text);
    pklib.utils.string.chars = chars;
});

// pklib.utils.string.rtrim
test("rtrim", function() {

    var result = "dog";

    var text = "dog   _-";
    strictEqual(pklib.utils.string.rtrim(text), result, "Right trim is good for: " + text);

    text = "dog-___ ";
    strictEqual(pklib.utils.string.rtrim(text), result, "Right trim is good for: " + text);

    text = "dog _      ";
    strictEqual(pklib.utils.string.rtrim(text), result, "Right trim is good for: " + text);

    text = "dog _  a    ";
    notEqual(pklib.utils.string.rtrim(text), result, "Right trim is good for letter: " + pklib.utils.string.chars.join(""));

    pklib.utils.string.chars.push("a");
    strictEqual(pklib.utils.string.rtrim(text), result, "Right trim is good for: " + text);
});

// pklib.utils.string.trim
test("trim", function() {

    var result = "dog";

    var text = "_ -- - \ndog   _-";
    strictEqual(pklib.utils.string.trim(text), result, "All trim is good for: " + text);

    text = "- - \t __----dog-___ ";
    strictEqual(pklib.utils.string.trim(text), result, "All trim is good for: " + text);

    text = "- ____--- dog _      ";
    strictEqual(pklib.utils.string.trim(text), result, "All trim is good for: " + text);

    text = "- ___$_--- dog _  $    ";
    pklib.utils.string.chars.push("$");
    strictEqual(pklib.utils.string.trim(text), result, "All trim is good for: " + text);
});

// pklib.utils.string.slug
test("slug", function() {

    var text = "Chrząszcz brzmię w Żółwiu";
    var result = "chrzaszcz-brzmie-w-zolwiu";
    strictEqual(pklib.utils.string.slug(text), result, "Slug is good for: " + text);

    var text = "Ch?$%^?4564565rząszcz brzmię w +Żółwiu";
    var result = "ch4564565rzaszcz-brzmie-w-zolwiu";
    strictEqual(pklib.utils.string.slug(text), result, "Slug is good for: " + text);
});

// pklib.utils.string.capitalize
test("capitalize", function() {

    var text = "dziewczYnka z zapaŁeczkami W doMku sobie Miaszkała ;)";
    var result = "Dziewczynka z zapałeczkami w domku sobie miaszkała ;)";

    strictEqual(pklib.utils.string.capitalize(text), result, "Capitalize is good for: " + text);

    text = "test-test";
    result = "Test-test";

    strictEqual(pklib.utils.string.capitalize(text), result, "Capitalize is good for: " + text);
});

// pklib.utils.string.delimiterSeparatedWords
test("delimiterSeparatedWords", function() {

    var text = "dziewczYnkazzapaŁeczkamiWdoMkusFobieMiaszkała ;)";
    var result = "dziewcz-ynkazzapa-łeczkami-wdo-mkus-fobie-miaszkała ;)";

    strictEqual(pklib.utils.string.delimiterSeparatedWords(text), result, "delimiterSeparatedWords is good for: " + text);

    var text = "testTest";
    var result = "test-test";

    strictEqual(pklib.utils.string.delimiterSeparatedWords(text), result, "delimiterSeparatedWords is good for: " + text);
});

// pklib.utils.string.camelCase
test("camelCase", function() {

    var text = "Dziewczynka-z-zapa-łe-czkami-";
    var result = "DziewczynkaZZapaŁeCzkami";

    strictEqual(pklib.utils.string.camelCase(text), result, "Camel case is good for: " + text);

    text = "test-test";
    result = "testTest";

    strictEqual(pklib.utils.string.camelCase(text), result, "Camel case is good for: " + text);
});

//pklib.utils.string.slice
test("slice", function() {

    var text = "Ciechocinek";
    var result = "Cie...";
    
    strictEqual(pklib.utils.string.slice(text, 3), result, "Slice is good for: " + text);
    
    text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam viverra tincidunt semper.";
    result = "Lorem ipsum dolor si...";
    
    strictEqual(pklib.utils.string.slice(text, 20), result, "Slice is good for: " + text);
});



module("pklib.utils");

// pklib.utils.merge
test("merge", function() {

    __array1 = [1, 2, 3];
    __array2 = [4, "a", 0];
    
    __arrayMerge = [0, 1, 2, 3, 4, "a"];

    deepEqual(pklib.utils.merge(__array1, __array2), __arrayMerge, "Merge array are OK");

    __object1 = {
        test: 2,
        dummny: [2]
    };
    __object2 = {
        test2: 2345,
        dummny2: [561235]
    };
    
    __objectMerge = {
        test: 2,
        test2: 2345,
        dummny: [2],
        dummny2: [561235]
    };

    deepEqual(pklib.utils.merge(__object1, __object2), __objectMerge, "Merge object are OK");
});

// pklib.utils.clearfocus
test("clearfocus", function() {
    
});

// pklib.utils.outerlink
test("outerlink", function() {
    
});

// pklib.utils.confirm
test("confirm", function() {
    
});



module("pklib.utils.animate");

// pklib.utils.animate.scrollTo
test("scrollTo", function() {
    
});

});

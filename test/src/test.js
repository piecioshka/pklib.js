/**
 * Test file
 * 
 * Use Qunit Test Framework
 */

pklib.utils.event.add(window, "load", function(){
    
module("pklib.borwser");

//pklib.browser.getName
test("getName", function(){
 
    var name = pklib.browser.getName();
    ok(name, "Browser name: " + name);
    ok(pklib.utils.string.isString(name), "Browser name is string");
});

//pklib.browser.getVersion
test("getVersion", function(){
 
    var version = pklib.browser.getVersion();
    ok(version, "Browser version: " + version);
    ok(pklib.utils.string.isString(version), "Browser version is string");
});



module("pklib.utils.css");
    
// pklib.utils.css.addClass
test("addClass", function(){
    var element = document.createElement("span");
    var cssClass = "active";
    pklib.utils.css.addClass(element, cssClass);
    
    ok(pklib.utils.css.hasClass(element, cssClass), "Element has class: " + cssClass);
});

// pklib.utils.css.removeClass
test("removeClass", function(){

    var element = document.createElement("span");
    var cssClass = "active";
    element.className = cssClass; 
    
    pklib.utils.css.removeClass(element, cssClass);
    
    ok(pklib.utils.css.hasClass(element, cssClass) === false, "Element has not class: " + cssClass);
});

// pklib.utils.css.hasClass
test("hasClass", function(){

    var element = document.createElement("span");
    var cssClass = "active";
    element.className = cssClass; 
    
    ok(pklib.utils.css.hasClass(element, cssClass), "Element has class: " + cssClass);
});



module("pklib.utils.dom");

//pklib.utils.dom.isNode
test("isNode", function(){

    var element = document.createElement("span");
    document.body.appendChild(element);
    
    strictEqual(pklib.utils.dom.isNode(element), pklib.utils.dom.nodeTypes[1], "Element is node");
    
    strictEqual(pklib.utils.dom.isNode({}), undefined, "Element is node");
});

// pklib.utils.dom.byId
test("byId", function(){

    var element = document.createElement("span");
    var id = "pklib-utils-dom-byId";
    element.id = id;
    
    document.body.appendChild(element);
    
    strictEqual(pklib.utils.dom.byId(id), element, "Element about id: " + id + " was found");
});

// pklib.utils.dom.byTag
test("byTag", function(){

    var tag = "special-tag";
    var element = document.createElement(tag);
    
    document.body.appendChild(element);
    
    strictEqual(pklib.utils.dom.byTag(tag)[0], element, "Element in tag: " + tag + " was found");
});

// pklib.utils.dom.index
test("index", function(){

    var area = document.createElement("div");
    var element = document.createElement("span");
    var element2 = document.createElement("span");

    area.appendChild(element);
    area.appendChild(element2);
    
    document.body.appendChild(area);
    
    strictEqual(pklib.utils.dom.index(element2), 1, "Element " + element2.nodeType + " have index 1");
});

// pklib.utils.dom.children
test("children", function(){

    var area = document.createElement("div");
    area.id = "pklib-utils-dom-children";
    var element = document.createElement("span");
    var element2 = document.createElement("span");

    area.appendChild(element);
    area.appendChild(element2);
    
    document.body.appendChild(area);
    
    deepEqual(pklib.utils.dom.children(pklib.utils.dom.byId(area.id)), [element, element2], "Element " + area.nodeType + " have 2 childs");
});

//pklib.utils.dom.center
test("center", function(){
    
    var element = document.createElement("div");
    element.id = "pklib-utils-dom-center";
     
    document.body.appendChild(element);
    
    var __center = pklib.utils.dom.center(pklib.utils.dom.byId(element.id));
     
    ok(pklib.utils.array.isArray(__center), "Params are in array");
    strictEqual(__center.length, 2, "Two params");
});



module("pklib.utils.array");

//pklib.utils.array.isArray
test("isArray", function(){
 
    var element = document.createElement("div");
    element.id = "pklib-utils-dom-center";
      
    document.body.appendChild(element);
    
    var __center = pklib.utils.dom.center(pklib.utils.dom.byId(element.id));
      
    ok(pklib.utils.array.isArray(__center), "Params are in array");
    strictEqual(__center.length, 2, "Two params");
});

//pklib.utils.array.inArray
test("inArray", function(){
 
    var __array = [];
    var element = 3;
    
    __array.push(element);

    ok(pklib.utils.array.inArray(__array, element) !== false, "Element is in array");
    strictEqual(pklib.utils.array.inArray(__array, element), 0, "Element is on first position in array");
});

//pklib.utils.array.unique
test("unique", function(){

    var __arrayRedundancy = [2, 3, 4, 2, 3, 4];
    var __array = [2, 3, 4];
    var __temp = pklib.utils.array.unique(__arrayRedundancy);
    
    deepEqual(__temp, __array, "Array with unique elements");
});

// pklib.utils.array.remove
test("remove", function(){

    var __array = [1];
    var __temp = [1];
    var element = 3;
    var element2 = 4;

    __array.push(element);
    __array.push(element2);
    
    pklib.utils.array.remove(__array, element);
    pklib.utils.array.remove(__array, element2);
    
    deepEqual(__array, __temp, "Elements in array removed");
});



module("pklib.utils.event");

//pklib.utils.event.add
test("add", function(){
 
    var element = document.createElement("a");
    document.body.appendChild(element);
     
    var type = "click";
    var event = pklib.utils.event.add(element, type, function(){
        alert(1); 
    });
     
    strictEqual(event.constructor, Event, "Event is add");
    strictEqual(event.type, type, "Type event is: " + type);
});

//pklib.utils.event.remove
test("remove", function(){
     
    var element = document.createElement("a");
    document.body.appendChild(element);
    
    var type = "click";
    var event = pklib.utils.event.add(element, type, function(){
        alert(1); 
    });
    
    strictEqual(event.constructor, Event, "Event is add");
    strictEqual(event.type, type, "Type event is: " + type);
    
    var removed = pklib.utils.event.remove(element, type, function(){
        alert(1); 
    });
    
    ok(removed, "Event was removed");
    
});


// pklib.utils.size.window

// pklib.utils.size.document

// pklib.utils.size.object


// pklib.utils.date.getFullMonth


// pklib.utils.string.ltrim

// pklib.utils.string.rtrim

// pklib.utils.string.trim

// pklib.utils.string.slug

// pklib.utils.string.isLetter

// pklib.utils.string.capitalize

// pklib.utils.string.delimiterSeparatedWords

// pklib.utils.string.camelCase


// pklib.utils.merge

// pklib.utils.clearfocus

// pklib.utils.outerlink

// pklib.utils.confirm

// pklib.utils.scrollTo


});
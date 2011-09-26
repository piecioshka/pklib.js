/**
 * @package pklib.utils
 * @dependence pklib.browser
 */
pklib = this.pklib || {};
pklib.utils = (function() {

    var doc = document;
    
    var walk_the_dom = function(node, func){
        func(node);
        node = node.firstChild;
        while(node){
            walk_the_dom(node, func);
            node = node.nextSibling;
        }
    };

    var __utils = {

        css : {

            /**
             * @param {HTMLElement} element
             * @param {string} cssClass
             */
            addClass : function(element, cssClass) {
                if (typeof element === "undefined" || element == null || typeof cssClass === "undefined") {
                    throw new TypeError("pklib.utils.css.addClass: Element is undefined/null or cssClass is undefined");
                }
                var classElement = element.className;
                if (!this.hasClass(element, cssClass)) {
                    if (classElement.length) {
                        classElement += " " + cssClass;
                    } else {
                        classElement = cssClass;
                    }
                }
                element.className = classElement;
            },

            /**
             * @param {HTMLElement} element
             * @param {string} cssClass
             */
            removeClass : function(element, cssClass) {
                if (typeof element === "undefined" || element == null || typeof cssClass === "undefined") {
                    throw new TypeError("pklib.utils.css.removeClass: Element is undefined/null or cssClass is undefined");
                }
                var regexp = new RegExp("(\s" + cssClass + ")|(" + cssClass + "\s)|" + cssClass, "i");
                element.className = element.className.replace(regexp, "");
            },

            /**
             * @param {HTMLElement} element
             * @param {string} cssClass
             * @return {boolean}
             */
            hasClass : function(element, cssClass) {
                if (typeof element === "undefined" || element == null || typeof cssClass === "undefined") {
                    throw new TypeError("pklib.utils.css.hasClass: Element is undefined/null or cssClass is undefined");
                }
                var regexp = new RegExp("(\s" + cssClass + ")|(" + cssClass + "\s)|" + cssClass, "i");
                return regexp.test(element.className);
            }

        },

        dom : {

            nodeTypes : {
                1 : "ELEMENT_NODE",
                2 : "ATTRIBUTE_NODE",
                3 : "TEXT_NODE",
                4 : "CDATA_SECTION_NODE",
                5 : "ENTITY_REFERENCE_NODE",
                6 : "ENTITY_NODE",
                7 : "PROCESSING_INSTRUCTION_NODE",
                8 : "COMMENT_NODE",
                9 : "DOCUMENT_NODE",
                10 : "DOCUMENT_TYPE_NODE",
                11 : "DOCUMENT_FRAGMENT_NODE",
                12 : "NOTATION_NODE"
            },

            /**
             * @param {HTMLElement} element
             * @return {string}
             */
            isNode : function(element) {
                return element && this.nodeTypes[element.nodeType] || null;
            },

            /**
             * @param {string} id
             * @param {HTMLElement} area
             * @return {HTMLElement}
             */
            byId : function(id, area) {
                area = area || doc;
                return area.getElementById(id);
            },

            /**
             * @param {string} tag
             * @param {HTMLElement} area
             * @return {HTMLCollection}
             */
            byTag : function(tag, area) {
                area = area || doc;
                return area.getElementsByTagName(tag);
            },
            
            /**
             * @param {string} cssClass
             * @param {HTMLElement} area
             * @return {HTMLCollection}
             */
            byClass : function(cssClass, area){
                area = area || doc;
                try {
                    return area.getElementsByClassName(cssClass);
                } catch(e) {
                    var results = [];
                    walk_the_dom(area, function(node){
                        if(pklib.utils.css.hasClass(node, cssClass)){
                            results.push(node);
                        }
                    });
                    return results;
                }
            },

            /**
             * @param {HTMLElement} element
             * @return {null or number}
             */
            index : function(element) {
                var parent = element.parentNode;
                var elements = this.children(parent);
                for ( var i = 0, len = elements.length; i < len; ++i) {
                    var item = elements[i];
                    if (item === element) {
                        return i;
                    }
                }
                return null;
            },

            /**
             * @param {HTMLElement} element
             * @return {array}
             */
            children : function(element) {
                for ( var i = 0, arr = [], childs = element.childNodes, len = childs.length; i < len; ++i) {
                    if (this.nodeTypes[childs[i].nodeType] === this.nodeTypes[1]) {
                        arr.push(childs[i]);
                    }
                }
                return arr;
            },

            /**
             * @param {HTMLElement} element
             * @param {HTMLElement} area
             * @return {array}
             */
            center : function(element, area) {
                var left, top;
                if (area === doc.body) {
                    left = (Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width")) - pklib.utils.size.object(element, "width")) / 2;
                    top = (Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height")) - pklib.utils.size.object(element, "height")) / 2;
                } else {
                    left = (pklib.utils.size.window("width") - pklib.utils.size.object(element, "width")) / 2;
                    top = (pklib.utils.size.window("height") - pklib.utils.size.object(element, "height")) / 2;
                }
                element.style.left = left + "px";
                element.style.top = top + "px";
                element.style.position = "absolute";
                return [ left, top ];
            },
            

            /**
             * @param {HTMLElement} element
             * @param {HTMLElement} contener
             * @return {array}
             */
            maximize: function(element, contener) {
                var width, height;
                if (contener === doc.body) {
                    width = Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width"));
                    height = Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height"));
                    if (pklib.browser.getName() === "msie") {
                        width -= 20;
                    }
                } else {
                    width = pklib.utils.size.object(contener, "width");
                    height = pklib.utils.size.object(contener, "height");
                }
                element.style.width = width;
                element.style.height = height;
                return [ width, height ];
            }

        },

        array : {

            /**
             * @param {HTMLElement} obj
             * @return {boolean}
             */
            isArray : function(obj) {
                return typeof obj === "object" && obj != null && typeof obj.length !== "undefined" && typeof obj.slice !== "undefined";
            },

            /**
             * @param {array} array
             * @param {any Object) param
             * @return {boolean or number}
             */
            inArray : function(array, param) {
                for ( var i = 0, len = array.length; i < len; ++i) {
                    if (array[i] === param) {
                        return i;
                    }
                }
                return false;
            },

            /**
             * @param {array} array
             * @return {array}
             */
            unique : function(array) {
                for ( var i = 0, temp = [], len = array.length; i < len; ++i) {
                    var item = array[i];
                    if (this.inArray.call(null, temp, item) === false) {
                        temp.push(item);
                    }
                }
                return temp;
            },

            /**
             * @param {array} array
             * @param {any Object}...
             * @return {array}
             */
            remove : function(array /*  */) {
                var params = Array.prototype.splice.call(arguments, 1);
                for ( var i = 0, len = params.length; i < len; ++i) {
                    var param = params[i], inside = this.inArray(array, param);
                    if (inside !== false) {
                        array.splice(inside, 1);
                    }
                }
                return array;
            }

        },

        event : {

            /**
             * @param {HTMLElement} target
             * @param {string} eventType
             * @param {function} callback
             * @param {boolean} bubbles
             * @return {Event}
             */
            add : function(target, eventType, callback, bubbles) {
                if (target.attachEvent) {
                    this.add = function(target, eventType, callback, bubbles) {
                        bubbles = bubbles || false;
                        target.attachEvent("on" + eventType, callback);

                        var evt = null;
                        try {
                            evt = doc.createEvent("Event");
                            evt.initEvent(eventType, bubbles, true);
                        } catch(e){
                            // pass
                        }
                        return evt;
                    };
                } else if (target.addEventListener) {
                    this.add = function(target, eventType, callback, bubbles) {
                        bubbles = bubbles || false;
                        target.addEventListener(eventType, callback, bubbles);

                        var evt = null;
                        try {
                            evt = doc.createEvent("Event");
                            evt.initEvent(eventType, bubbles, true);
                        } catch(e){
                            // pass
                        }
                        return evt;
                    };
                }

                this.add(target, eventType, callback, bubbles);
            },

            /**
             * @param {HTMLElement} target
             * @param {string} eventType
             * @param {function} callback
             * @param {boolean} bubbles
             * @return {boolean}
             */
            remove : function(target, eventType, callback, bubbles) {
                if (target.detachEvent) {
                    this.remove = function(target, eventType, callback) {
                        target.detachEvent("on" + eventType, callback);
                        return true;
                    };
                } else if (target.removeEventListener) {
                    this.remove = function(target, eventType, callback, bubbles) {
                        bubbles = bubbles || false;
                        target.removeEventListener(eventType, callback, bubbles);
                        return true;
                    };
                }
                return this.remove(target, eventType, callback, bubbles);
            }

        },

        size : {

            /**
             * @param {string} name
             * @returns {number}
             */
            window : function(name) {
                if (typeof name === "undefined") {
                    throw new TypeError("pklib.utils.size.window: Parameter name is mandatory");
                }
                name = pklib.utils.string.capitalize(name);
                var win = window, clientName = win.document.documentElement["client" + name];
                return win.document.compatMode === "CSS1Compat" && clientName || win.document.body["client" + name] || clientName;
            },

            /**
             * @param {string} name
             * @return {number}
             */
            document : function(name) {
                if (typeof name === "undefined") {
                    throw new TypeError("pklib.utils.size.document: Parameter name is mandatory");
                }
                name = pklib.utils.string.capitalize(name);
                var clientName = doc.documentElement["client" + name], scrollBodyName = doc.body["scroll" + name], scrollName = doc.documentElement["scroll" + name], offsetBodyName = doc.body["offset" + name], offsetName = doc.documentElement["offset" + name];
                return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
            },

            /**
             * @param {HTMLElement} obj
             * @param {string} name
             * @return {number}
             */
            object : function(obj, name) {
                if (typeof name === "undefined" || typeof obj === "undefined") {
                    throw new TypeError("pklib.utils.size.object: Parameter name is mandatory");
                }
                name = pklib.utils.string.capitalize(name);
                var client = obj["client" + name], scroll = obj["scroll" + name], offset = obj["offset" + name];
                return Math.max(client, scroll, offset);
            }

        },

        ascii : {

            letters : {
                lower : [ 113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97, 115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118, 98, 110, 109 ],
                upper : [ 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77 ]
            }

        },

        date : {

            /**
             * @return {string}
             */
            getFullMonth : function() {
                var month = (parseInt(new Date().getMonth(), 10) + 1);
                return (month < 10) ? "0" + month : month;
            }

        },

        string : {

            /**
             * @param {any Object} source
             * @return {boolean}
             */
            isString : function(source) {
                return typeof source === "string";
            },

            /**
             * @param {any Object} source
             * @return {boolean}
             */
            isLetter : function(source) {
                return typeof source === "string" && /^[a-zA-Z]$/.test(source);
            },

            /**
             * @param {string} source
             * @return {string}
             */
            trim : function(source) {
                return source.replace(/^\s+|\s+$/g, "");
            },

            /**
             * @param {string} source
             * @return {string}
             */
            slug : function(source) {
                var result = source.toLowerCase().replace(/\s/mg, "-");
                result = result.replace(/[^a-zA-Z0-9\-]/mg, function(ch) {
                    switch (ch.charCodeAt()) {
                        case 261:
                            return String.fromCharCode(97);
                        case 281:
                            return String.fromCharCode(101);
                        case 243:
                            return String.fromCharCode(111);
                        case 347:
                            return String.fromCharCode(115);
                        case 322:
                            return String.fromCharCode(108);
                        case 378:
                        case 380:
                            return String.fromCharCode(122);
                        case 263:
                            return String.fromCharCode(99);
                        case 324:
                            return String.fromCharCode(110);

                        default:
                            return "";
                    }
                });
                return result;
            },

            /**
             * @param {string} source
             * @return {string}
             */
            capitalize : function(source) {
                return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
            },

            /**
             * @param {string} source
             * @return {string}
             */
            delimiterSeparatedWords : function(source) {
                return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function(match) {
                    return "-" + match.toLowerCase();
                });
            },

            /**
             * @param {string} source
             * @return {string}
             */
            camelCase : function(source) {
                while (source.indexOf("-") != -1) {
                    var pos = source.indexOf("-"), pre = source.substr(0, pos), sub = source.substr(pos + 1, 1).toUpperCase(), post = source.substring(pos + 2, source.length);
                    source = pre + sub + post;
                }
                return source;
            },

            /**
             * @param {string} source
             * @param {number} len
             * @return {string}
             */
            slice : function(source, len) {
                for ( var item = 0, text = "", num = source.length; item < num; ++item) {
                    text += source[item];
                    if (item == len - 1) {
                        if (num - len >= 1) {
                            text += "...";
                        }
                        break;
                    }
                }

                return text;
            }

        },

        action : {

            /**
             * @param {HTMLElement} obj
             */
            clearfocus : function(obj) {
                if (typeof obj !== "undefined") {
                    pklib.utils.event.add(obj, "focus", function() {
                        if (this.value === this.defaultValue) {
                            this.value = "";
                        }
                    });
                    pklib.utils.event.add(obj, "blur", function() {
                        if (this.value === "") {
                            this.value = this.defaultValue;
                        }
                    });
                }
            },

            /**
             * @param {HTMLElement} area
             */
            outerlink : function(area) {
                area = area || doc;
                var links = pklib.utils.dom.byTag("a");
                for ( var i = 0, len = links.length; i < len; ++i) {
                    var link = links[i];
                    if (link.rel === "outerlink") {
                        pklib.utils.event.add(link, "click", function(e) {
                            window.open(this.href);
                            e.preventDefault();
                        });
                    }
                }
            },

            /**
             * @param {HTMLElement} element
             * @param {string} text
             */
            confirm : function(element, text) {
                if (typeof element !== "undefined") {
                    text = text || "Sure?";

                    pklib.utils.event.add(element, "click", function(evt) {
                        var response = confirm(text);
                        if (true === response) {
                            return true;
                        } else {
                            evt.preventDefault();
                        }
                    });
                }
            }

        },

        animate : {

            /**
             * @param param
             * @param {boolean} animate
             */
            scrollTo : function(param, animate) {
                if (true === animate) {
                    var interval = null;
                    interval = setInterval(function() {
                        doc.body.scrollTop -= 5;
                        if (doc.body.scrollTop <= 0) {
                            clearInterval(interval);
                        }
                    }, 1);
                } else {
                    doc.body.scrollTop = param;
                }
            }

        },

        /**
         * @param {array or object} target
         * @param {array or object} source
         * @return {array}
         */
        merge : function(target, source) {
            if (this.array.isArray(target) && this.array.isArray(source)) {
                for ( var i = 0, len = source.length; i < len; ++i) {
                    var element = source[i];
                    if (!this.array.inArray(target, element)) {
                        target.push(element);
                    }
                }
                return target.sort();
            } else {
                for ( var item in source) {
                    if (source.hasOwnProperty(item)) {
                        target[item] = source[item];
                    }
                }
                return target;
            }
        }

    };

    return __utils;

})();

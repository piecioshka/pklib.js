/**
 * @package pklib.utils
 * @dependence pklib.browser
 */
pklib = this.pklib || {};
pklib.utils = (function() {

    var doc = document;

    var __utils = {

        css : {

            /**
             * @param {HTMLElement} element
             * @param {string} className
             */
            addClass : function(element, className) {
                if (typeof element === "undefined" || element == null || typeof className === "undefined") {
                    throw new TypeError();
                }
                var classElement = element.className;
                if (!this.hasClass(element, className)) {
                    if (classElement.length) {
                        classElement += " " + className;
                    } else {
                        classElement = className;
                    }
                }
                element.className = classElement;
            },

            /**
             * @param {HTMLElement} element
             * @param {string} className
             */
            removeClass : function(element, className) {
                if (typeof element === "undefined" || element == null || typeof className === "undefined") {
                    throw new TypeError();
                }
                var regexp = new RegExp("(\s" + className + ")|(" + className + "\s)|" + className, "i");
                element.className = element.className.replace(regexp, "");
            },

            /**
             * @param {HTMLElement} element
             * @param {string} className
             * @return {boolean}
             */
            hasClass : function(element, className) {
                if (typeof element === "undefined" || element == null || typeof className === "undefined") {
                    throw new TypeError();
                }
                var regexp = new RegExp("(\s" + className + ")|(" + className + "\s)|" + className, "i");
                return regexp.test(element.className);
            }

        },

        dom : {

            nodeTypes : {
                1 : 'ELEMENT_NODE',
                2 : 'ATTRIBUTE_NODE',
                3 : 'TEXT_NODE',
                4 : 'CDATA_SECTION_NODE',
                5 : 'ENTITY_REFERENCE_NODE',
                6 : 'ENTITY_NODE',
                7 : 'PROCESSING_INSTRUCTION_NODE',
                8 : 'COMMENT_NODE',
                9 : 'DOCUMENT_NODE',
                10 : 'DOCUMENT_TYPE_NODE',
                11 : 'DOCUMENT_FRAGMENT_NODE',
                12 : 'NOTATION_NODE'
            },

            /**
             * @param {HTMLElement} element
             * @return {string}
             */
            isNode : function(element) {
                return this.nodeTypes[element.nodeType];
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
                    if (childs[i].nodeType !== doc.TEXT_NODE) {
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
                if (area === doc.getElementsByTagName("body")[0]) {
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

                        var evt = doc.createEvent("Event");
                        evt.initEvent(eventType, bubbles, true);
                        return evt;
                    };
                } else if (target.addEventListener) {
                    this.add = function(target, eventType, callback, bubbles) {
                        bubbles = bubbles || false;
                        target.addEventListener(eventType, callback, bubbles);

                        var evt = doc.createEvent("Event");
                        evt.initEvent(eventType, bubbles, true);
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

            window : function(name) {
                name = pklib.utils.string.capitalize(name);
                var win = window, clientName = win.document.documentElement["client" + name];
                return win.document.compatMode === "CSS1Compat" && clientName || win.document.body["client" + name] || clientName;
            },

            document : function(name) {
                name = pklib.utils.string.capitalize(name);
                var clientName = doc.documentElement["client" + name], scrollBodyName = doc.body["scroll" + name], scrollName = doc.documentElement["scroll" + name], offsetBodyName = doc.body["offset"
                        + name], offsetName = doc.documentElement["offset" + name];
                return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
            },

            object : function(obj, name) {
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

            getFullMonth : function() {
                var month = (parseInt(new Date().getMonth(), 10) + 1);
                return (month < 10) ? "0" + month : month;
            }

        },

        string : {

            /**
             * @param {any Object} obj
             * @return {boolean}
             */
            isString : function(obj) {
                return typeof obj === "string" || /[a-zA-Z]/.test(obj);
            },

            chars : [ " ", "-", "_", "\n", "\r", "\t" ],

            ltrim : function(source) {
                return source.replace(new RegExp("^[" + this.chars + "]+", "g"), "");
            },

            rtrim : function(source) {
                return source.replace(new RegExp("[" + this.chars + "]+$", "g"), "");
            },

            trim : function(source) {
                return this.ltrim(this.rtrim(source));
            },

            slug : function(source) {
                for ( var i = 0, result = '', len = source.length; i < len; ++i) {
                    var letter = source[i].toLowerCase().charCodeAt(0);
                    switch (letter) {
                        case 380:
                        case 378:
                            result += 'z';
                            break;
                        case 347:
                            result += 's';
                            break;
                        case 324:
                            result += 'n';
                            break;
                        case 322:
                            result += 'l';
                            break;
                        case 263:
                            result += 'c';
                            break;
                        case 261:
                            result += 'a';
                            break;
                        case 243:
                            result += 'o';
                            break;
                        case 281:
                            result += 'e';
                            break;

                        case 63:
                        case 43:
                        case 42:
                        case 32:
                        case 33:
                            result += '-';
                            break;
                        default:
                            result += String.fromCharCode(letter);
                    }
                }
                return result;
            },

            isLetter : function(source) {
                return /^[a-zA-Z]$/.test(source);
            },

            capitalize : function(source) {
                return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
            },

            delimiterSeparatedWords : function(source) {
                return source.replace(/[A-Z]/g, function(match) {
                    return "-" + match.toLowerCase();
                });
            },

            camelCase : function(source) {
                while (source.indexOf("-") != -1) {
                    var pos = source.indexOf("-"), pre = source.substr(0, pos), sub = source.substr(pos + 1, 1).toUpperCase(), post = source.substring(pos + 2, source.length);
                    source = pre + sub + post;
                }
                return source;
            },

            slice : function(source, len) {
                for ( var item = 0, text = "", num = source.length; item < num; ++item) {
                    text += source[item];
                    if (item == len) {
                        if (num - len > 3) {
                            text += "...";
                        }
                        break;
                    }
                }

                return text;
            }

        },

        merge : function(target, source) {
            for ( var el in source) {
                if (source.hasOwnProperty(el)) {
                    if (typeof target[el] === "object" && target[el] != null) {
                        if (target[el].parentNode != null) {
                            target[el] = source[el];
                            continue;
                        }
                        target[el] = arguments.callee(target[el], source[el]);
                    } else {
                        target[el] = source[el];
                    }
                }
            }
            return target;
        },

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

        outerlink : function(area) {
            area = area || doc;
            var links = area.getElementsByTagName("a");
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
        },

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

    };

    return __utils;

})();

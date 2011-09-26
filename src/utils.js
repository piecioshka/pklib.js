/**
 * @package utils
 * @dependence array, browser, dom, event, string
 */
pklib = this.pklib || {};
pklib.utils = (function() {

    var doc = document;

    var walk_the_dom = function(node, func) {
        func(node);
        node = node.firstChild;
        while(node) {
            walk_the_dom(node, func);
            node = node.nextSibling;
        }
    };
    return {

        size : {

            /**
             * @param {string} name
             * @returns {number}
             */
            window : function(name) {
                if( typeof name === "undefined") {
                    throw new TypeError("pklib.utils.size.window: Parameter name is mandatory");
                }
                name = pklib.string.capitalize(name);
                var win = window;
                var clientName = win.document.documentElement["client" + name];
                return win.document.compatMode === "CSS1Compat" && clientName || win.document.body["client" + name] || clientName;
            },
            /**
             * @param {string} name
             * @return {number}
             */
            document : function(name) {
                if( typeof name === "undefined") {
                    throw new TypeError("pklib.utils.size.document: Parameter name is mandatory");
                }
                name = pklib.string.capitalize(name);
                var clientName = doc.documentElement["client" + name];
                var scrollBodyName = doc.body["scroll" + name];
                var scrollName = doc.documentElement["scroll" + name];
                var offsetBodyName = doc.body["offset" + name];
                var offsetName = doc.documentElement["offset" + name];
                return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
            },
            /**
             * @param {HTMLElement} obj
             * @param {string} name
             * @return {number}
             */
            object : function(obj, name) {
                if( typeof name === "undefined" || typeof obj === "undefined") {
                    throw new TypeError("pklib.utils.size.object: Parameter name is mandatory");
                }
                name = pklib.string.capitalize(name);
                var client = obj["client" + name], scroll = obj["scroll" + name], offset = obj["offset" + name];
                return Math.max(client, scroll, offset);
            }
        },

        ascii : {

            letters : {
                lower : [113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97, 115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118, 98, 110, 109],
                upper : [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]
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

        action : {

            /**
             * @param {HTMLElement} obj
             */
            clearfocus : function(obj) {
                if( typeof obj !== "undefined") {
                    pklib.event.add(obj, "focus", function() {
                        if(this.value === this.defaultValue) {
                            this.value = "";
                        }
                    });
                    pklib.event.add(obj, "blur", function() {
                        if(this.value === "") {
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
                var links = pklib.dom.byTag("a");
                for(var i = 0, len = links.length; i < len; ++i) {
                    var link = links[i];
                    if(link.rel === "outerlink") {
                        pklib.event.add(link, "click", function(e) {
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
                if( typeof element !== "undefined") {
                    text = text || "Sure?";

                    pklib.event.add(element, "click", function(evt) {
                        var response = confirm(text);
                        if(true === response) {
                            return true;
                        } else {
                            evt.preventDefault();
                        }
                    });
                }
            }
        },

        /**
         * @param param
         * @param {boolean} animate
         */
        scrollTo : function(param, animate) {
            if(true === animate) {
                var interval = null;
                interval = setInterval(function() {
                    doc.body.scrollTop -= 5;
                    if(doc.body.scrollTop <= 0) {
                        clearInterval(interval);
                    }
                }, 1);
            } else {
                doc.body.scrollTop = param;
            }
        },
        /**
         * @param {array or object} target
         * @param {array or object} source
         * @return {array}
         */
        merge : function(target, source) {
            if(pklib.array.isArray(target) && pklib.array.isArray(source)) {
                for(var i = 0, len = source.length; i < len; ++i) {
                    var element = source[i];
                    if(!pklib.array.inArray(element, target)) {
                        target.push(element);
                    }
                }
                return target.sort();
            } else {
                for(var item in source) {
                    if(source.hasOwnProperty(item)) {
                        target[item] = source[item];
                    }
                }
                return target;
            }
        }
    };

})();

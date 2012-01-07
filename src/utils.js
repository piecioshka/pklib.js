/**
 * Utils tools
 * @package utils
 * @dependence array, browser, dom, event, string
 */
(function (win) {
    'use strict';

    var pklib = win.pklib || {},
        document = win.document || {};

    pklib.utils = {
        size: {
            /**
             * @param {string} name
             * @returns {number}
             */
            window: function (name) {
                var clientName;
                if (typeof name === "undefined") {
                    throw new TypeError("pklib.utils.size.window: Parameter name is mandatory");
                }
                name = pklib.string.capitalize(name);
                clientName = win.document.documentElement["client" + name];
                return (win.document.compatMode === "CSS1Compat" && clientName) || win.document.body["client" + name] || clientName;
            },
            /**
             * @param {string} name
             * @return {number}
             */
            document: function (name) {
                var clientName,
                    scrollBodyName,
                    scrollName,
                    offsetBodyName,
                    offsetName;
                if (typeof name === "undefined") {
                    throw new TypeError("pklib.utils.size.document: Parameter name is mandatory");
                }
                name = pklib.string.capitalize(name);
                clientName = document.documentElement["client" + name];
                scrollBodyName = document.body["scroll" + name];
                scrollName = document.documentElement["scroll" + name];
                offsetBodyName = document.body["offset" + name];
                offsetName = document.documentElement["offset" + name];
                return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
            },
            /**
             * @param {HTMLElement} obj
             * @param {string} name
             * @return {number}
             */
            object: function (obj, name) {
                if (typeof name === "undefined" || typeof obj === "undefined") {
                    throw new TypeError("pklib.utils.size.object: Parameter name is mandatory");
                }
                name = pklib.string.capitalize(name);
                var client = obj["client" + name], scroll = obj["scroll" + name], offset = obj["offset" + name];
                return Math.max(client, scroll, offset);
            }
        },
        ascii: {
            letters: {
                lower: [113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97, 115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118, 98, 110, 109],
                upper: [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]
            }
        },
        date: {
            /**
             * @return {string}
             */
            getFullMonth: function () {
                var month = (parseInt(new Date().getMonth(), 10) + 1);
                return (month < 10) ? "0" + month : month;
            }
        },
        action: {
            /**
             * @param {HTMLElement} obj
             */
            clearfocus: function (obj) {
                if (typeof obj !== "undefined") {
                    pklib.event.add(obj, "focus", function () {
                        if (this.value === this.defaultValue) {
                            this.value = "";
                        }
                    });
                    pklib.event.add(obj, "blur", function () {
                        if (this.value === "") {
                            this.value = this.defaultValue;
                        }
                    });
                }
            },
            /**
             * @param {HTMLElement} area
             */
            outerlink: function (area) {
                area = area || document;
                var i,
                    link,
                    links = pklib.dom.byTag("a"),
                    len = links.length,
                    opentrigger = function (evt) {
                        win.open(this.href);
                        evt.preventDefault();
                    };
                for (i = 0; i < len; i += 1) {
                    link = links[i];
                    if (link.rel === "outerlink") {
                        pklib.event.add(link, "click", opentrigger.bind(link));
                    }
                }
            },
            /**
             * @param {HTMLElement} element
             * @param {string} text
             */
            confirm: function (element, text) {
                var response;
                if (typeof element !== "undefined") {
                    text = text || "Sure?";

                    pklib.event.add(element, "click", function (evt) {
                        response = win.confirm(text);
                        if (true === response) {
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
        scrollTo: function (param, animate) {
            var interval = null;
            if (true === animate) {
                interval = win.setInterval(function () {
                    document.body.scrollTop -= 5;
                    if (document.body.scrollTop <= 0) {
                        win.clearInterval(interval);
                    }
                }, 1);
            } else {
                document.body.scrollTop = param;
            }
        }
    };
}(this));

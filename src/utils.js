/**
 * @package pklib.utils
 * @dependence pklib.common, pklib.dom, pklib.event
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        document = global.document || {},
        /**
         * @private
         * @function
         * @param {Event} evt
         */
        opentrigger = function (evt) {
            var url = "";

            if (evt.originalTarget &&
                    typeof evt.originalTarget === "object" &&
                    typeof evt.originalTarget.href !== "undefined") {
                url = evt.originalTarget.href;
            } else if (evt.toElement &&
                    typeof evt.toElement === "object" &&
                    typeof evt.toElement.href !== "undefined") {
                url = evt.toElement.href;
            } else if (evt.srcElement &&
                    typeof evt.srcElement === "object" &&
                    typeof typeof evt.srcElement !== "undefined") {
                url = evt.srcElement.href;
            }

            global.open(url);

            try {
                evt.preventDefault();
            } catch (ignore) {
                global.event.returnValue = false;
            }

            return false;
        },
        /**
         * Utils tools
         * @namespace
         */
        utils = {
            /**
             * Numbers of chars in ASCII system
             * @memberOf utils
             * @namespace
             */
            ascii: {
                letters: {
                    lower: [113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97, 115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118, 98, 110, 109],
                    upper: [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]
                }
            },
            /**
             * @namespace
             * @memberOf utils
             */
            action: {
                /**
                 * @function
                 * @param {HTMLElement} obj
                 */
                clearfocus: function (obj) {
                    if (pklib.dom.is_element(obj)) {
                        pklib.event.add(obj, "focus", function () {
                            if (obj.value === obj.defaultValue) {
                                obj.value = "";
                            }
                        });
                        pklib.event.add(obj, "blur", function () {
                            if (obj.value === "") {
                                obj.value = obj.defaultValue;
                            }
                        });
                    }
                },
                /**
                 * @function
                 * @param {HTMLElement} area
                 */
                outerlink: function (area) {
                    var i, len,
                        link, links;

                    area = area || document;

                    links = pklib.dom.by_tag("a", area);
                    len = links.length;

                    for (i = 0; i < len; ++i) {
                        link = links[i];
                        if (link.rel === "outerlink") {
                            pklib.event.add(link, "click", opentrigger.bind(link));
                        }
                    }
                },
                /**
                 * @function
                 * @param {HTMLElement} element
                 * @param {String} [text="Sure?"]
                 */
                confirm: function (element, text) {
                    var response;
                    if (typeof element !== "undefined") {
                        text = text || "Sure?";

                        pklib.event.add(element, "click", function (evt) {
                            response = global.confirm(text);
                            if (!response) {
                                try {
                                    evt.preventDefault();
                                } catch (ignore) {
                                    global.event.returnValue = false;
                                }

                                return false;
                            }
                            return true;
                        });
                    }
                }
            }
        };

    pklib.utils = utils;
}(this));

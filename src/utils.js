/**
 * Utils tools
 * @package pklib.utils
 * @dependence pklib.common, pklib.dom, pklib.event
 */
(function (global) {
    "use strict";
    var pklib = global.pklib || {},
        document = global.document || {};

    pklib.utils = {
        ascii: {
            letters: {
                lower: [113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97, 115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118, 98, 110, 109],
                upper: [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]
            }
        },
        action: {
            /**
             * @param obj {HTMLElement}
             */
            clearfocus: function clearfocus(obj) {
                if (pklib.dom.isElement(obj)) {
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
             * @param area {HTMLElement}
             */
            outerlink: function outerlink(area) {
                area = area || document;
                var i,
                    link,
                    links = pklib.dom.byTag("a", area),
                    len = links.length;

                function opentrigger(evt) {
                    global.open(this.href);
                    evt.preventDefault();
                }

                for (i = 0; i < len; ++i) {
                    link = links[i];
                    if (link.rel === "outerlink") {
                        pklib.event.add(link, "click", opentrigger.bind(link));
                    }
                }
            },
            /**
             * @param element {HTMLElement}
             * @param text {String}
             */
            confirm: function confirm(element, text) {
                var response;
                if (typeof element !== "undefined") {
                    text = text || "Sure?";

                    pklib.event.add(element, "click", function (evt) {
                        response = global.confirm(text);
                        if (pklib.common.assert(response, true)) {
                            return true;
                        } else {
                            evt.preventDefault();
                        }
                    });
                }
            }
        }
    };
}(this));

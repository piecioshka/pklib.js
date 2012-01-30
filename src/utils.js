/**
 * Utils tools
 * @package pklib.utils
 * @dependence pklib.dom, pklib.event
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
             * @param area {HTMLElement}
             */
            outerlink: function (area) {
                area = area || document;
                var i,
                    link,
                    links = pklib.dom.byTag("a"),
                    len = links.length,
                    opentrigger = function (evt) {
                        global.open(this.href);
                        evt.preventDefault();
                    };

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
            confirm: function (element, text) {
                var response;
                if (typeof element !== "undefined") {
                    text = text || "Sure?";

                    pklib.event.add(element, "click", function (evt) {
                        response = global.confirm(text);
                        if (true === response) {
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

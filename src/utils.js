/**
 * @package pklib.utils
 * @dependence pklib.common, pklib.dom, pklib.event
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});
    var add_event = pklib.event.add;

    /**
     * @param {Event} evt
     */
    function open_trigger(evt) {
        var url = "";

        if (evt.originalTarget &&
                typeof evt.originalTarget === "object" &&
                evt.originalTarget.href !== undefined) {
            url = evt.originalTarget.href;
        } else if (evt.toElement &&
                typeof evt.toElement === "object" &&
                evt.toElement.href !== undefined) {
            url = evt.toElement.href;
        } else if (evt.srcElement &&
                typeof evt.srcElement === "object" &&
                evt.srcElement !== undefined) {
            url = evt.srcElement.href;
        }

        global.open(url);

        try {
            evt.preventDefault();
        } catch (ignore) {
            global.event.returnValue = false;
        }

        return false;
    }

    /**
     * @param {HTMLElement} obj
     */
    function clear_focus(obj) {
        if (pklib.dom.is_element(obj)) {
            add_event(obj, "focus", function () {
                if (obj.value === obj.defaultValue) {
                    obj.value = "";
                }
            });
            add_event(obj, "blur", function () {
                if (obj.value === "") {
                    obj.value = obj.defaultValue;
                }
            });
        }
    }

    /**
     * @param {HTMLElement} [area]
     */
    function outerlink(area) {
        var i, len,
            link, links;

        area = area || document;

        links = pklib.dom.by_tag("a", area);
        len = links.length;

        for (i = 0; i < len; ++i) {
            link = links[i];
            if (link.rel === "outerlink") {
                add_event(link, "click", open_trigger.bind(link));
            }
        }
    }

    /**
     * @param {HTMLElement} element
     * @param {string} [text]
     */
    function confirm(element, text) {
        var response;
        if (element !== undefined) {
            text = text || "Sure?";

            add_event(element, "click", function (evt) {
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

    // exports
    pklib.utils = {
        /**
         * numbers of chars in ASCII system
         */
        ascii: {
            letters: {
                lower: [113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97,
                    115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118,
                    98, 110, 109],
                upper: [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68,
                    70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]
            }
        },

        action: {
            clearfocus: clear_focus,
            outerlink: outerlink,
            confirm: confirm
        }
    };

}(this));

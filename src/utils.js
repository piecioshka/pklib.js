/**
 * @package pklib.utils
 * @dependence pklib.common, pklib.dom, pklib.event
 */

/**
 * Utils tools
 * @namespace
 */
pklib.utils = (function () {
    "use strict";

    /**
     * @private
     * @function
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

        window.open(url);

        try {
            evt.preventDefault();
        } catch (ignore) {
            window.event.returnValue = false;
        }

        return false;
    }

    /**
     * @private
     * @function
     * @param {HTMLElement} obj
     */
    function clear_focus(obj) {
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
    }

    /**
     * @private
     * @function
     * @param {HTMLElement} area
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
                pklib.event.add(link, "click", open_trigger.bind(link));
            }
        }
    }

    /**
     * @private
     * @function
     * @param {HTMLElement} element
     * @param {String} [text="Sure?"]
     */
    function confirm(element, text) {
        var response;
        if (element !== undefined) {
            text = text || "Sure?";

            pklib.event.add(element, "click", function (evt) {
                response = window.confirm(text);
                if (!response) {
                    try {
                        evt.preventDefault();
                    } catch (ignore) {
                        window.event.returnValue = false;
                    }

                    return false;
                }
                return true;
            });
        }
    }

    // public API
    return {
        /**
         * Numbers of chars in ASCII system
         * @memberOf pklib.utils
         * @field
         * @namespace
         */
        ascii: {
            /**
             * @memberOf pklib.utils.ascii
             * @field
             * @namespace
             */
            letters: {
                /**
                 * @memberOf pklib.utils.ascii.letters
                 * @field
                 * @type {Array}
                 */
                lower: [113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97, 115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118, 98, 110, 109],

                /**
                 * @memberOf pklib.utils.ascii.letters
                 * @field
                 * @type {Array}
                 */
                upper: [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]
            }
        },

        /**
         * @memberOf pklib.utils
         * @namespace
         */
        action: {
            clearfocus: clear_focus,
            outerlink: outerlink,
            confirm: confirm
        }
    };
}());

/**
 * @package pklib.ui.size
 * @dependence pklib.string
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        document = global.document || {},
        /**
         * Check ui dimensions
         * @namespace
         */
        size = {
            /**
             * @memberOf size
             * @function
             * @param {String} name
             * @throws {TypeError}
             * @returns {Number}
             */
            window: function (name) {
                var clientName;
                if (typeof name === "undefined") {
                    throw new TypeError("pklib.ui.size.window: @name: undefined");
                }
                name = pklib.string.capitalize(name);
                clientName = document.documentElement["client" + name];
                return (document.compatMode === "CSS1Compat" && clientName) ||
                    document.body["client" + name] ||
                    clientName;
            },
            /**
             * @memberOf size
             * @function
             * @param {String} name
             * @returns {Number}
             */
            document: function (name) {
                var clientName,
                    scrollBodyName,
                    scrollName,
                    offsetBodyName,
                    offsetName;
                if (typeof name === "undefined") {
                    throw new TypeError("pklib.ui.size.document: @name: undefined");
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
             * @memberOf size
             * @function
             * @param {HTMLElement} obj
             * @param {String} name
             * @returns {Number}
             */
            object: function (obj, name) {
                if (typeof name === "undefined") {
                    throw new TypeError("pklib.ui.size.object: @name: undefined");
                }
                if (!pklib.dom.isNode(obj)) {
                    throw new TypeError("pklib.ui.size.object: @obj: is not node");
                }
                name = pklib.string.capitalize(name);
                var client = obj["client" + name],
                    scroll = obj["scroll" + name],
                    offset = obj["offset" + name];
                return Math.max(client, scroll, offset);
            }
        };

    pklib.ui = global.pklib.ui || {};
    pklib.ui.size = size;
}(this));

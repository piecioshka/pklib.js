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
                pklib.common.assert(typeof name === "string", "pklib.ui.size.window: @name: not {String}");

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

                pklib.common.assert(typeof name === "string", "pklib.ui.size.document: @name: not {String}");

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
                pklib.common.assert(typeof name === "string", "pklib.ui.size.object: @name: not {String}");
                pklib.common.assert(pklib.dom.is_node(obj), "pklib.ui.size.object: @obj: not {HTMLElement}");

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

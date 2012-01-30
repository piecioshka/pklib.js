/**
 * @package pklib.ui.size
 */
(function (global) {
    "use strict";
    
    var pklib = global.pklib || {};

    pklib.ui.size = {
        /**
         * @param name {String}
         * @throws {TypeError}
         * @return {Number}
         */
        window: function (name) {
            var clientName;
            if (typeof name === "undefined") {
                throw new TypeError("pklib.ui.size.window: @name: undefined");
            }
            name = pklib.string.capitalize(name);
            clientName = global.document.documentElement["client" + name];
            return (global.document.compatMode === "CSS1Compat" && clientName) || global.document.body["client" + name] || clientName;
        },
        /**
         * @param name {String}
         * @return {Number}
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
         * @param obj {HTMLElement}
         * @param name {String}
         * @return {number}
         */
        object: function (obj, name) {
            if (typeof name === "undefined" || typeof obj === "undefined") {
                throw new TypeError("pklib.ui.size.object: @name: undefined");
            }
            name = pklib.string.capitalize(name);
            var client = obj["client" + name], scroll = obj["scroll" + name], offset = obj["offset" + name];
            return Math.max(client, scroll, offset);
        }
    };
}(this));

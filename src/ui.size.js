/**
 * @package pklib.ui.size
 * @dependence pklib.string
 */

/**
 * Check ui dimensions
 * @namespace
 */
pklib.ui.size = (function () {
    "use strict";

    /**
     * @private
     * @function
     * @param {String} name
     * @throws {TypeError}
     * @returns {Number}
     */
    function size_of_window(name) {
        var clientName;
        pklib.common.assert(typeof name === "string", "pklib.ui.size.window: @name: not {String}");

        name = pklib.string.capitalize(name);
        clientName = document.documentElement["client" + name];
        return (document.compatMode === "CSS1Compat" && clientName) ||
            document.body["client" + name] ||
            clientName;
    }

    /**
     * @private
     * @function
     * @param {String} name
     * @returns {Number}
     */
    function size_of_document(name) {
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
    }

    /**
     * @private
     * @function
     * @param {HTMLElement} obj
     * @param {String} name
     * @returns {Number}
     */
    function size_of_object(obj, name) {
        pklib.common.assert(typeof name === "string", "pklib.ui.size.object: @name: not {String}");
        pklib.common.assert(pklib.dom.is_element(obj), "pklib.ui.size.object: @obj: not {HTMLElement}");

        name = pklib.string.capitalize(name);
        var client = obj["client" + name],
            scroll = obj["scroll" + name],
            offset = obj["offset" + name];
        return Math.max(client, scroll, offset);
    }

    // public APi
    return {
        window: size_of_window,
        document: size_of_document,
        object: size_of_object
    };
}());


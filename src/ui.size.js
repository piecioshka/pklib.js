/**
 * @package pklib.ui.size
 * @dependence pklib.string
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    /**
     * @param {string} name
     * @throws {TypeError}
     * @return {number}
     */
    function size_of_window(name) {
        var clientName;
        pklib.common.assert(typeof name === "string", "pklib.ui.size.window: @name: not {string}");

        name = pklib.string.capitalize(name);
        clientName = document.documentElement["client" + name];
        return (document.compatMode === "CSS1Compat" && clientName) ||
            document.body["client" + name] ||
            clientName;
    }

    /**
     * @param {string} name
     * @return {number}
     */
    function size_of_document(name) {
        var clientName,
            scrollBodyName,
            scrollName,
            offsetBodyName,
            offsetName;

        pklib.common.assert(typeof name === "string", "pklib.ui.size.document: @name: not {string}");

        name = pklib.string.capitalize(name);
        clientName = document.documentElement["client" + name];
        scrollBodyName = document.body["scroll" + name];
        scrollName = document.documentElement["scroll" + name];
        offsetBodyName = document.body["offset" + name];
        offsetName = document.documentElement["offset" + name];
        return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
    }

    /**
     * @param {HTMLElement} obj
     * @param {string} name
     * @return {number}
     */
    function size_of_object(obj, name) {
        pklib.common.assert(typeof name === "string", "pklib.ui.size.object: @name: not {string}");
        pklib.common.assert(pklib.dom.is_element(obj), "pklib.ui.size.object: @obj: not {HTMLElement}");

        name = pklib.string.capitalize(name);
        var client = obj["client" + name],
            scroll = obj["scroll" + name],
            offset = obj["offset" + name];
        return Math.max(client, scroll, offset);
    }

    // public API
    pklib.ui.size = {
        window: size_of_window,
        document: size_of_document,
        object: size_of_object
    };

}(this));


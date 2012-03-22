/**
 * Module to service array object
 * @package pklib.array
 */
(function (global) {
    "use strict";
    var pklib = global.pklib || {};

    pklib.array =  {
        /**
         * Check if param is array,
         * @param array {Object}
         * @return {Boolean}
         */
        isArray: function isArray(array) {
            return pklib.common.assert(typeof array === "object" &&
                array !== null &&
                typeof array.length !== "undefined" &&
                typeof array.slice !== "undefined", true);
        },
        /**
         * Check if element is in array by loop.
         * @param param
         * @param array {Array}
         * @return {Boolean}
         */
        inArray: function inArray(param, array) {
            var i, len = array.length;
            for (i = 0; i < len; ++i) {
                if (array[i] === param) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Get index of element
         * @param item
         * @param array {Array}
         * @throws {ReferenceError}
         * @return {Boolean}
         */
        index: function index(item, array) {
            var i, len = array.length;
            for (i = 0; i < len; ++i) {
                if (array[i] === item) {
                    return i;
                }
            }
            throw new ReferenceError("pklib.array.index: @item not exists");
        },
        /**
         * Unique array. Delete element what was duplicated.
         * @param array {Array}
         * @return {Array}
         */
        unique: function unique(array) {
            var i, item, temp = [], len = array.length;
            for (i = 0; i < len; ++i) {
                item = array[i];
                if (!pklib.array.inArray.call(null, item, temp)) {
                    temp.push(item);
                }
            }
            return temp;
        },
        /**
         * Remove element declarated in infinity params without first.
         * First parameter is array object.
         * @param array {Array}
         * @param {Undefined}
         * @return {Array}
         */
        remove: function remove(array) {
            var i, param,
                params = Array.prototype.slice.call(arguments, 1),
                len = params.length;

            for (i = 0; i < len; ++i) {
                param = params[i];
                if (pklib.array.inArray(param, array)) {
                    array.splice(pklib.array.index(param, array), 1);
                }
            }
            return array;
        }
    };
}(this));

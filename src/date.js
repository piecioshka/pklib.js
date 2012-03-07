/**
 * Utils stack to Date object
 * @package pklib.date
 */
(function (global) {
    "use strict";

    var pklib = global.pklib;

    pklib.date = {
        /**
         * @return {string}
         */
        getFullMonth: function getFullMonth() {
            var month = (parseInt(new Date().getMonth(), 10) + 1);
            return (month < 10) ? "0" + month : month;
        }
    };
}(this));

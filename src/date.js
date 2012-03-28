/**
 * @package pklib.date
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        /**
         * Utils stack to Date object
         * @namespace
         */
        date = {
            /**
             * @returns {String}
             */
            getFullMonth: function () {
                var month = (parseInt(new Date().getMonth(), 10) + 1);
                return (month < 10) ? "0" + month : month;
            }
        };

    pklib.date = date;
}(this));

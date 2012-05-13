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
             * Simple return month in string and file 0 at first place if month smaller than 10
             * @memberOf date
             * @function
             * @returns {String}
             */
            getFullMonth: function () {
                var month = (parseInt(new Date().getMonth(), 10) + 1);

                if (month < 10) {
                    month = "0" + month;
                }

                return String(month);
            }
        };

    pklib.date = date;
}(this));

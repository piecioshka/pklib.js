(function (global) {
    "use strict";

    var pklib = global.pklib;

    pklib.event.add(window, "load", function () {

        module("pklib.date");

        test("getFullMonth", function() {
            var month = pklib.date.getFullMonth();
            var dateMonth = new Date().getMonth();
            if (dateMonth <= 9) {
                dateMonth = parseInt(dateMonth, 10) + 1;
                dateMonth = "0" + dateMonth;
            }
            strictEqual(month, dateMonth, "Month is " + month);
        });
    });
}(this));

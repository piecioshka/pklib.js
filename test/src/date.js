(function (global) {
    "use strict";
    var pklib = global.pklib;

    pklib.event.add(global, "load", function () {
        module("pklib.date");

        test("get_full_month", function() {
            var month = pklib.date.get_full_month();
            var dateMonth = new Date().getMonth();
            if (dateMonth <= 9) {
                dateMonth = parseInt(dateMonth, 10) + 1;
                dateMonth = "0" + dateMonth;
            }
            strictEqual(month, dateMonth, "Month is " + month);
        });
    });
}(this));

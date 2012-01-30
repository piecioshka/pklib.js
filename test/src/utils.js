pklib.event.add(window, "load", function () {

    module("pklib.utils.date");

    test("getFullMonth", function() {
        var month = pklib.utils.date.getFullMonth();
        var dateMonth = new Date().getMonth();
        if (dateMonth <= 9) {
            dateMonth = parseInt(dateMonth, 10) + 1;
            dateMonth = "0" + dateMonth;
        }
        strictEqual(month, dateMonth, "Month is " + month);
    });

    module("pklib.utils.action");

    test("clearfocus", function() {
        // go to Selenium tests
    });
    test("outerlink", function() {
        // go to Selenium tests
    });
    test("confirm", function() {
        // go to Selenium tests
    });

    module("pklib.utils.animate");

    test("scrollTo", function() {
        // go to Selenium tests
    });
});

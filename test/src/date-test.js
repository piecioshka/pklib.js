/********************************************************************************/
/* pklib.date TestCase */
/********************************************************************************/

buster.testCase("pklib.date", {
    "get_full_month": function () {
        var month = pklib.date.get_full_month();
        var dateMonth = new Date().getMonth();
        dateMonth = parseInt(dateMonth, 10) + 1;

        if (dateMonth <= 9) {
            dateMonth = "0" + dateMonth;
        }
        assert.equals(month, dateMonth, "Month is " + month);
    }
});

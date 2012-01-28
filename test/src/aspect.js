pklib.event.add(window, "load", function () {
    
    module("pklib.aspect");

    function test_aspect () {
        var x = "";
        this.a = function () {
            x += "a";
        };
        this.b = function () {
            x += "b";
        };
        this.get = function () {
            return x;
        };
    }
    test("Simple ascpect", function () {
        var test = new test_aspect();
        test.a = pklib.aspect(test.a, test.b);
        test.a();
        strictEqual(test.get(), "ba", "Aspecting simple method");
    });
});

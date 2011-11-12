window.addEventListener("load", function () {
    
    module("pklib.aspect");
    
    test("Simple ascpect", function () {
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
        
        var test = new test_aspect();
        test.a = pklib.aspect(test.a, test.b);
        test.a();
                
        strictEqual(test.get(), "ba", "Aspecting simple method");
    });
        
});

/********************************************************************************/
/* pklib.aspect TestCase */
/********************************************************************************/

function TestAspect() {
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

buster.testCase("pklib.aspect", {
    "aspect": function () {
        var test = new TestAspect();
        test.a = pklib.aspect(test.a, test.b);
        test.a();
        assert.equals(test.get(), "ba", "Aspecting simple method");
    },

    "aspect-after": function () {
        var r = 0,
            a = function () {
                r = 2;
            },
            b = function () {
                r = 3;
            };
        pklib.aspect(a, b, "after")();
        assert.equals(r, 3, "'After' aspect it's okey");
    },

    "aspect-before": function () {
        var r = 0,
            a = function () {
                r = 2;
            },
            b = function () {
                r = 3;
            };
        pklib.aspect(a, b, "before")();
        assert.equals(r, 2, "'Before' aspect it's okey");
    }
});

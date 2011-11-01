window.addEventListener("load", function () {

    module("pklib.string");

    // pklib.string.isString
    test("isString", function() {

        var source = 45345;
        notEqual(pklib.string.isString(source), true, "Is not string");

        source = "asdasd";
        ok(pklib.string.isString(source), "Is string");

        source = "as345345345dasd";
        ok(pklib.string.isString(source), "Is string");

        source = [];
        notEqual(pklib.string.isString(source), true, "Is not string");

        source = {
            3 : 4
        };
        notEqual(pklib.string.isString(source), true, "Is not string");

        source = [ "a" ];
        notEqual(pklib.string.isString(source), true, "Is not string");

        source = function() {
            return this;
        };
        notEqual(pklib.string.isString(source), true, "Is not string");
    });

    // pklib.string.isLetter
    test("isLetter", function() {

        var source = 45345;
        notEqual(pklib.string.isLetter(source), true, "Is not letter");

        source = "2";
        notEqual(pklib.string.isLetter(source), true, "Is not letter");

        source = "G";
        strictEqual(pklib.string.isLetter(source), true, "Is letter");

        source = 5;
        notEqual(pklib.string.isLetter(source), true, "Is not letter");

        source = [];
        notEqual(pklib.string.isLetter(source), true, "Is not letter");

        source = {
            3 : 4
        };
        notEqual(pklib.string.isLetter(source), true, "Is not letter");

        source = [ "a" ];
        notEqual(pklib.string.isLetter(source), true, "Is not letter");

        source = function() {
            return this;
        };
        notEqual(pklib.string.isLetter(source), true, "Is not letter");
    });

    // pklib.string.trim
    test("trim", function() {

        var result = "dog";

        var text = "" +
                "dog   ";
        strictEqual(pklib.string.trim(text), result, "1) trim is good for: " + text);

        text = "    dog ";
        strictEqual(pklib.string.trim(text), result, "2) trim is good for: " + text);

        text = " dog ";
        strictEqual(pklib.string.trim(text), result, "3) trim is good for: " + text);

        text = "dog";
        strictEqual(pklib.string.trim(text), result, "4) trim is good for: " + text);

        text = " \ndog ";
        strictEqual(pklib.string.trim(text), result, "5) trim is good for: " + text);

        text = " \tdog ";
        strictEqual(pklib.string.trim(text), result, "6) trim is good for: " + text);
    });

    // pklib.string.slug
    test("slug", function() {

        var text = "Chrząszcz brzmię w Żółwiu";
        var result = "chrzaszcz-brzmie-w-zolwiu";
        strictEqual(pklib.string.slug(text), result, "Slug is good for: " + text);

        var text = "Ch?$%^?4564565rząszcz brzmię w +Żółwiu";
        var result = "ch4564565rzaszcz-brzmie-w-zolwiu";
        strictEqual(pklib.string.slug(text), result, "Slug is good for: " + text);
    });

    // pklib.string.capitalize
    test("capitalize", function() {

        var text = "dziewczYnka z zapaŁeczkami W doMku sobie Miaszkała ;)";
        var result = "Dziewczynka z zapałeczkami w domku sobie miaszkała ;)";

        strictEqual(pklib.string.capitalize(text), result, "Capitalize is good for: " + text);

        text = "test-test";
        result = "Test-test";

        strictEqual(pklib.string.capitalize(text), result, "Capitalize is good for: " + text);
    });

    // pklib.string.delimiterSeparatedWords
    test("delimiterSeparatedWords", function() {

        var text = "dziewczYnkazzapaŁeczkamiWdoMkusFobieMiaszkała ;)";
        var result = "dziewcz-ynkazzapa-łeczkami-wdo-mkus-fobie-miaszkała ;)";

        strictEqual(pklib.string.delimiterSeparatedWords(text), result, "delimiterSeparatedWords is good for: " + text);

        var text = "testTest";
        var result = "test-test";

        strictEqual(pklib.string.delimiterSeparatedWords(text), result, "delimiterSeparatedWords is good for: " + text);
    });

    // pklib.string.camelCase
    test("camelCase", function() {

        var text = "Dziewczynka-z-zapa-łe-czkami-";
        var result = "DziewczynkaZZapaŁeCzkami";

        strictEqual(pklib.string.camelCase(text), result, "Camel case is good for: " + text);

        text = "test-test";
        result = "testTest";

        strictEqual(pklib.string.camelCase(text), result, "Camel case is good for: " + text);
    });

    // pklib.string.slice
    test("slice", function() {

        var text = "Ciechocinek";
        var result = "Cie...";

        strictEqual(pklib.string.slice(text, 3), result, "Slice is good for: " + text);

        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam viverra tincidunt semper.";
        result = "Lorem ipsum dolor si...";

        strictEqual(pklib.string.slice(text, 20), result, "Slice is good for: " + text);
    });
    
});

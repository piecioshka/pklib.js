/********************************************************************************/
/* pklib.string TestCase */
/********************************************************************************/

buster.testCase("pklib.string", {
    "is_string": function () {
        var source = 45345;
        refute.equals(pklib.string.is_string(source), true, "Is not string");
        source = "asdasd";
        assert(pklib.string.is_string(source), "Is string");
        source = "as345345345dasd";
        assert(pklib.string.is_string(source), "Is string");
        source = [];
        refute.equals(pklib.string.is_string(source), true, "Is not string");
        source = {
            3 : 4
        };
        refute.equals(pklib.string.is_string(source), true, "Is not string");
        source = [ "a" ];
        refute.equals(pklib.string.is_string(source), true, "Is not string");
        source = function () {
            return this;
        };
        refute.equals(pklib.string.is_string(source), true, "Is not string");
    },

    "is_letter": function () {
        var source = 45345;
        refute.equals(pklib.string.is_letter(source), true, "Is not letter");
        source = "2";
        refute.equals(pklib.string.is_letter(source), true, "Is not letter");
        source = "G";
        assert.equals(pklib.string.is_letter(source), true, "Is letter");
        source = 5;
        refute.equals(pklib.string.is_letter(source), true, "Is not letter");
        source = [];
        refute.equals(pklib.string.is_letter(source), true, "Is not letter");
        source = {
            3 : 4
        };
        refute.equals(pklib.string.is_letter(source), true, "Is not letter");
        source = [ "a" ];
        refute.equals(pklib.string.is_letter(source), true, "Is not letter");
        source = function () {
            return this;
        };
        refute.equals(pklib.string.is_letter(source), true, "Is not letter");
    },

    "trim": function () {
        var result = "dog";
        var text = "" +
                "dog   ";
        assert.equals(pklib.string.trim(text), result, "1) trim is good for: " + text);
        text = "    dog ";
        assert.equals(pklib.string.trim(text), result, "2) trim is good for: " + text);
        text = " dog ";
        assert.equals(pklib.string.trim(text), result, "3) trim is good for: " + text);
        text = "dog";
        assert.equals(pklib.string.trim(text), result, "4) trim is good for: " + text);
        text = " \ndog ";
        assert.equals(pklib.string.trim(text), result, "5) trim is good for: " + text);
        text = " \tdog ";
        assert.equals(pklib.string.trim(text), result, "6) trim is good for: " + text);
    },

    "slug": function () {
        var text = "Chrząszcz brzmię w Żółwiu";
        var result = "chrzaszcz-brzmie-w-zolwiu";
        assert.equals(pklib.string.slug(text), result, "Slug is good for: " + text);
        var text = "Ch?$%^?4564565rząszcz brzmię w +Żółwiu";
        var result = "ch4564565rzaszcz-brzmie-w-zolwiu";
        assert.equals(pklib.string.slug(text), result, "Slug is good for: " + text);
    },

    "capitalize": function () {
        var text = "dziewczYnka z zapaŁeczkami W doMku sobie Miaszkała ;)";
        var result = "Dziewczynka z zapałeczkami w domku sobie miaszkała ;)";
        assert.equals(pklib.string.capitalize(text), result, "Capitalize is good for: " + text);
        text = "test-test";
        result = "Test-test";
        assert.equals(pklib.string.capitalize(text), result, "Capitalize is good for: " + text);
    },

    "delimiter_separated_words": function () {
        var text = "dziewczYnkazzapaŁeczkamiWdoMkusFobieMiaszkała ;)";
        var result = "dziewcz-ynkazzapa-łeczkami-wdo-mkus-fobie-miaszkała ;)";
        assert.equals(pklib.string.delimiter_separated_words(text), result, "delimiter_separated_words is good for: " + text);
        var text = "testTest";
        var result = "test-test";
        assert.equals(pklib.string.delimiter_separated_words(text), result, "delimiter_separated_words is good for: " + text);
    },

    "strip_tags": function () {
        var text = "<a>testTest<\/a>";
        var result = "testTest";
        assert.equals(pklib.string.strip_tags(text), result, "strip_tags is good for: " + text);
    },

    "camel_case": function () {
        var text = "Dziewczynka-z-zapa-łe-czkami-";
        var result = "DziewczynkaZZapaŁeCzkami";
        assert.equals(pklib.string.camel_case(text), result, "Camel case is good for: " + text);
        text = "test-test";
        result = "testTest";
        assert.equals(pklib.string.camel_case(text), result, "Camel case is good for: " + text);
    },

    "slice": function () {
        var text, result;

        text = "morze jest długie";
        result = "morze...";
        assert.equals(pklib.string.slice(text, 5), result, "Phrase: " + text);
        assert.equals(pklib.string.slice(text, 6), result, "Phrase: " + text);

        text = "Ciechocinek";
        result = "Cie...";
        assert.equals(pklib.string.slice(text, 3), result, "Phrase: " + text);

        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam viverra tincidunt semper.";
        result = "Lorem ipsum dolor si...";
        assert.equals(pklib.string.slice(text, 20, true), result, "Phrase: " + text);

        text = "Mistrzostwa Europy EuroBasket Słowienia 2013";
        result = "Mistrzostwa Europy EuroBasket Słowienia...";
        assert.equals(pklib.string.slice(text, 41), result, "Phrase: " + text);

        text = "krótki tekst";
        result = text;
        assert.equals(pklib.string.slice(text, 100), result, "Phrase: " + text);
    },

    "format": function () {
        assert(true);
        // TODO
    },

    "lpad": function () {
        assert.equals(pklib.string.lpad(2, 2, "0"), "02", "2 -> 02");
    },

    "rpad": function () {
        assert.equals(pklib.string.rpad(2, 2, "0"), "20", "2 -> 20");
    }
});

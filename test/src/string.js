(function (global) {
    "use strict";

    pklib.event.add(global, "load", function () {
        module("pklib.string");

        test("is_string", function () {
            var source = 45345;
            notEqual(pklib.string.is_string(source), true, "Is not string");
            source = "asdasd";
            ok(pklib.string.is_string(source), "Is string");
            source = "as345345345dasd";
            ok(pklib.string.is_string(source), "Is string");
            source = [];
            notEqual(pklib.string.is_string(source), true, "Is not string");
            source = {
                3 : 4
            };
            notEqual(pklib.string.is_string(source), true, "Is not string");
            source = [ "a" ];
            notEqual(pklib.string.is_string(source), true, "Is not string");
            source = function () {
                return this;
            };
            notEqual(pklib.string.is_string(source), true, "Is not string");
        });
        test("is_letter", function () {
            var source = 45345;
            notEqual(pklib.string.is_letter(source), true, "Is not letter");
            source = "2";
            notEqual(pklib.string.is_letter(source), true, "Is not letter");
            source = "G";
            strictEqual(pklib.string.is_letter(source), true, "Is letter");
            source = 5;
            notEqual(pklib.string.is_letter(source), true, "Is not letter");
            source = [];
            notEqual(pklib.string.is_letter(source), true, "Is not letter");
            source = {
                3 : 4
            };
            notEqual(pklib.string.is_letter(source), true, "Is not letter");
            source = [ "a" ];
            notEqual(pklib.string.is_letter(source), true, "Is not letter");
            source = function () {
                return this;
            };
            notEqual(pklib.string.is_letter(source), true, "Is not letter");
        });
        test("trim", function () {
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
        test("slug", function () {
            var text = "Chrząszcz brzmię w Żółwiu";
            var result = "chrzaszcz-brzmie-w-zolwiu";
            strictEqual(pklib.string.slug(text), result, "Slug is good for: " + text);
            var text = "Ch?$%^?4564565rząszcz brzmię w +Żółwiu";
            var result = "ch4564565rzaszcz-brzmie-w-zolwiu";
            strictEqual(pklib.string.slug(text), result, "Slug is good for: " + text);
        });
        test("capitalize", function () {
            var text = "dziewczYnka z zapaŁeczkami W doMku sobie Miaszkała ;)";
            var result = "Dziewczynka z zapałeczkami w domku sobie miaszkała ;)";
            strictEqual(pklib.string.capitalize(text), result, "Capitalize is good for: " + text);
            text = "test-test";
            result = "Test-test";
            strictEqual(pklib.string.capitalize(text), result, "Capitalize is good for: " + text);
        });
        test("delimiter_separated_words", function () {
            var text = "dziewczYnkazzapaŁeczkamiWdoMkusFobieMiaszkała ;)";
            var result = "dziewcz-ynkazzapa-łeczkami-wdo-mkus-fobie-miaszkała ;)";
            strictEqual(pklib.string.delimiter_separated_words(text), result, "delimiter_separated_words is good for: " + text);
            var text = "testTest";
            var result = "test-test";
            strictEqual(pklib.string.delimiter_separated_words(text), result, "delimiter_separated_words is good for: " + text);
        });
        test("strip_tags", function () {
            var text = "<a>testTest<\/a>";
            var result = "testTest";
            strictEqual(pklib.string.strip_tags(text), result, "strip_tags is good for: " + text);
        });
        test("camel_case", function () {
            var text = "Dziewczynka-z-zapa-łe-czkami-";
            var result = "DziewczynkaZZapaŁeCzkami";
            strictEqual(pklib.string.camel_case(text), result, "Camel case is good for: " + text);
            text = "test-test";
            result = "testTest";
            strictEqual(pklib.string.camel_case(text), result, "Camel case is good for: " + text);
        });
        test("slice", function () {
            var text = "Ciechocinek";
            var result = "Cie...";
            strictEqual(pklib.string.slice(text, 3), result, "Slice is good for: " + text);
            text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam viverra tincidunt semper.";
            result = "Lorem ipsum dolor si...";
            strictEqual(pklib.string.slice(text, 20), result, "Slice is good for: " + text);
        });
    });

}(this));

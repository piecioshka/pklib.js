# pklib.js - Simple JavaScript library [![Build Status](https://secure.travis-ci.org/piecioshka/pklib.js.png?branch=master)](http://travis-ci.org/piecioshka/pklib.js)

`pklib.js` is results of repeat the same patterns on Web engines, to create the same things.

## Example

Module `pklib.profiler`:

```javascript
pklib.common.defer(function () {
    var filenames = ["test.js", "example.js"];
    pklib.file.loadjs(filenames, function (file) {
        console.log("file: " + file.src + " loaded");
    });
});
```

## Warning

DEPRECATED! Please be careful when you use library form `tags` directory.
This are my working directory from a long time.

## License

[The MIT License][0]

[0]: http://piecioshka.mit-license.org/


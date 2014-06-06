# pklib.js - Simple JavaScript library [![Build Status](https://secure.travis-ci.org/piecioshka/pklib.js.png?branch=master)](http://travis-ci.org/piecioshka/pklib.js)

`pklib.js` is results of repeat the same patterns on Web engines, to create the same thing, for instance _overlayer_.

## Example

Module `pklib.profiler`

```javascript
pklib.common.defer(function () {
    var filenames = ["test.js", "example.js"];
    pklib.file.loadjs(filenames, function (file) {
        console.log("file: " + file.src + " loaded");
    });
});
```

## License

[The MIT License][2]

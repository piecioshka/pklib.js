# pklib.js

> `pklib.js` is results of repeat the same patterns on web engines, to create the same things.

## Install

```
<script src="dist/pklib.js"></script>
```

## Usage

Module `pklib.profiler`:

```javascript
pklib.common.defer(function () {
    var filenames = ['test.js', 'example.js'];

    pklib.file.loadjs(filenames, function (file) {
        console.log('file: ' + file.src + ' loaded');
    });
});
```

## Warning!

DEPRECATED! Please be careful when you use library form `tags` directory.
This are my working directory from a long time.

## License

[The MIT License](http://piecioshka.mit-license.org/)

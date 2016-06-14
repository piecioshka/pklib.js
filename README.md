# pklib.js

![](https://img.shields.io/badge/version-2.0.0-brightgreen.svg)
![](https://img.shields.io/badge/depracated-true-ff69b4.svg)

> `pklib.js` is results of repeat the same patterns on web engines, to create the same things.

## Warning!

**DEPRECATED! Please be careful when you use library form `tags` directory.**<br/>
**This are my working directory from a long time.**

## Install

```html
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

## License

[The MIT License](http://piecioshka.mit-license.org/) @ 2011

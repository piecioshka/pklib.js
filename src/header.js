/**
 * pklib JavaScript library v1.2.2
 * 
 * Copyright (c) 2012 Piotr Kowalski, http://pklib.com/
 *
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *  
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Date: Sun, 24 Nov 2013 18:33:34 GMT
 */

/*jslint continue: true, nomen: true, plusplus: true, regexp: true, vars: true, white: true, indent: 4 */
/*global document, XMLHttpRequest, ActiveXObject, setInterval, clearInterval, setTimeout, clearTimeout */

var pklib = {
    VERSION: "1.2.2"
};

if (typeof Function.prototype.bind !== "function") {
    /**
     * Creates a new function that, when called, itself calls this function in the context of the provided this value,
     * with a given sequence of arguments preceding any provided when the new function was called.
     *
     * Method of "Function"
     * Implemented in JavaScript 1.8.5
     * ECMAScript Edition ECMAScript 5th Edition
     *
     * @param {*} that Context
     * @return {Function}
     */
    Function.prototype.bind = function (that) {
        "use strict";

        var method = this,
            slice = [].slice,
            args = slice.apply(arguments, [1]);

        return function () {
            return method.apply(that, args.concat(slice.apply(arguments, [0])));
        };
    };
}


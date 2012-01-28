/**
 * pklib JavaScript library v1.0.4
 * 
 * Copyright (c) 2012 Piotr Kowalski, http://pklib.com/
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
 * Date: Sat Jan 28 20:04:54 GMT 2012
 */

(function (global) {
    "use strict";

    global.pklib = {
        author: "Piotr Kowalski",
        www: "http://pklib.com/",
        version: "1.0.4"
    };
}(this));

if (typeof Function.prototype.bind !== "function") {
	Function.prototype.bind = function (that) {
	    "use strict";
	    var method = this,
	        slice = Array.prototype.slice,
	        args = slice.apply(arguments, [1]);
	    return function () {
	        return method.apply(that, args.concat(slice.apply(arguments, [0])));
	    };
	};
}
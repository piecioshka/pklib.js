/*!
 * pklib JavaScript library 1.0.0
 * http://pklib.com/
 * 
 * Copyright 2011, Piotr Kowalski
 * Public Domain
 * http://pklib.com/license
 * 
 * Date: Thu May 26 2011 10:21:18 GMT+0200
 */

// pklib definition and initialization
pklib = this.pklib || {
    author : "Piotr Kowalski",
    www : "http://pklib.pl/",
    version : "1.0.0",
};

// Remove element in array
Array.prototype.remove = Array.prototype.remove || function() {
    for ( var i = 0, len = arguments.length; i < len; ++i) {
        if (typeof this.splice !== "undefined") {
            this.splice(arguments[i], 1);
        }
    }
    return this;
};

// Remove duplicates from array
Array.prototype.unique = Array.prototype.unique || function() {
    for ( var i = 0, newArr = [], len = this.length; i < len; ++i) {
        if (!Array.prototype.inArray.call(newArr, this[i])) {
            newArr.push(this[i]);
        }
    }
    return newArr;
};

// Check value if is in array
Array.prototype.inArray = Array.prototype.inArray || function(parameter) {
    for ( var i = 0, len = this.length; i < len; ++i) {
        if (this[i] === parameter) {
            return true;
        }
    }
    return false;
};

// Check if string is letter
String.prototype.isLetter = String.prototype.isLetter || function() {
    return (/^[a-zA-Z]$/.test(this));
};

// Get full month, from 1-12, with 'zero' when month is one number
Date.prototype.getFullMonth = Date.prototype.getFullMonth || function() {
    var month = (parseInt(new Date().getMonth(), 10) + 1);
    return (month < 10) ? "0" + month : month;
};

// Hours on the date of zeroes
Date.prototype.trunc = Date.prototype.trunc || function() {
    var time = this.getTime(), offset = this.getTimezoneOffset() * 60000, rest = (time - offset) % 86400000;
    this.setTime(time - rest);
    return rest;
};

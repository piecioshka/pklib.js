/*!
 * pklib JavaScript Library 1.0.0
 * http://pklib.com/
 * 
 * Copyright 2011, Piotr Kowalski
 * GNU General Public License
 * http://pklib.com/license
 * 
 * Dependence jQuery 1.3.x or high!
 * http://jquery.com/
 * 
 * Date: Thu May 26 2011 10:21:18 GMT+0200
 */

if (typeof jQuery != 'function'){
    throw new Error('jQuery is need\'ed ! Please visit: http://jquery.com/');
}

// pklib definition and initialization
pklib = this.pklib || {
    author: 'Piotr Kowalski',
    www: 'http://pklib.pl/',
    version: '1.0.0',
};

// Add alias name 'bind' to 'addEvent'. This is better to syntax language
jQuery.fn.addEvent = jQuery.fn.bind;

// Add alias 'unbind' to 'removeEvent'. This is better to syntax language
jQuery.fn.removeEvent = jQuery.fn.unbind;

// Remove element in array
Array.prototype.remove = Array.prototype.remove || function() {
	for(var i = 0; i < arguments.length; ++i){
		if (typeof this.splice != 'undefined') this.splice(arguments[i], 1);
	}
    return this;
}

// Remove duplicates from array
Array.prototype.unique = Array.prototype.unique || function() {
	for(var effect = 0; effect < 3; ++effect){
		for(var i = 0; i < this.length; ++i){
			for(var j = i + 1 ; j < this.length; ++j){
				if (this[i] === this[j]) this.remove(j);
			}
		}
	}
    return this;
}

// Check value if is in array
Array.prototype.inArray = Array.prototype.inArray || function(parameter) {
	for(var i = 0; i < this.length; ++i){
		if (this[i] === parameter) return true;
	}
	return false;
}

// Check if string is letter
String.prototype.isLetter = String.prototype.isLetter || function() {
	if (this.length === 1){
        var ascii = pklib.utils.slug(this[0]).charCodeAt(),
            lowercase = pklib.utils.ascii.letters.lower,
            uppercase = pklib.utils.ascii.letters.upper;
        if (lowercase.inArray(ascii) || uppercase.inArray(ascii)){
            return true;
        }
		return false;
	}
	return false;
}

// Get full month, from 1-12, with 'zero' when month is one number
Date.prototype.getFullMonth = Date.prototype.getFullMonth || function(){
	var month = (parseInt(new Date().getMonth(), 10) + 1);
	if(month < 10){
		month = '0' + month;
	}
	return month;
}

// Hours on the date of zeroes
Date.prototype.trunc = Date.prototype.trunc || function() {
    var time = this.getTime(),
        offset = this.getTimezoneOffset() * 60000,
        rest = (time - offset) % 86400000;
    this.setTime(time - rest);
    return rest;
}

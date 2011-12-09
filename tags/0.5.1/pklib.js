/**
 * Private Library
 * Library helped to useful things.
 * Library is compatibility with IE6
 * 
 * Library use jQuery 1.x.x
 *
 * Copyright (c) 2010 Piotr Kowalski (piecioshka.pl)
 * License GNU  
 * 
 * @author Piotr Kowalski <piotr.kowalski@piecioshka.pl>
 * 
 */

/**
 * Main location to site
 */
if( DOMAIN == undefined ){
    var DOMAIN = '.';
}

/**
 * Directory spacer
 */
if( DS == undefined ){
    var DS = '/';
}

function ExceptionHandler( error ){
	var msg = error.message  + " at line " + error.lineNumber + " in file " + error.fileName;
	console.error( error.name + ":", msg );
	/*
	 * Under Construction
	 * 
	 * document.cookie = error.name + "=" + escape(msg);
	 */
};

/**
 * New Instance
 */
var pklib = {

    _autor: "Piotr Kowalski",
    _version: "0.5.1",
    _lastModified: "2010/04/26",
    
    /**
     * Open link in new window
     * 
     * @param place string Place where links will be open in new window
     */
    outerlink: function( place ){
    
        if( place == undefined ) {
            place = "";
        }
    
        $( place + "a").each(function(){
            if( $(this).attr("rel") == "outerlink" ){
                $(this).unbind('click');
                $(this).bind('click', function(){
                    window.open( $(this).attr("href") );
                    return false;
                });
            }
        });
    },
    
    /**
     * Open confirmation window
     * 
     * @param object JQuery object, which on click show disclaimer
     * @param text Text in confirmation disclaimer
     */
    confirm: function( object, text ) {
    	
    	try {

	    	if(object == undefined){
	    		throw new Error('Variable do not exists');
	    	}
    		
	    	if(object.constructor != Object){
	    		throw new Error('Variable type is not right');
	    	}
	    	
    	} catch(e){
    		ExceptionHandler(e);
    		return;
    	}
    	
        var go = false;
        
        if( text == undefined ){
            text = "Czy kontunuujesz?";
        }
        
        object.bind('click', function() {
            go = confirm( text );
            if( go == true ){
                window.location = $(this).attr('href');
            }
            return false;
        });
        
    },

    /**
     * Object manage content fields
     */
    content: {
    
        /**
         * Clear content by focus object
         * 
         * @param object objectToClear JQuery Object to Clear
         * @return void
         */
        clearfocus: function( objectToClear ){
    	
	    	try {
	
	    		if(objectToClear == undefined){
	    			throw new Error('Variable do not exists');
	    		}
	    		
	    		if(objectToClear.constructor != Object){
	    			throw new Error('Variable type is not right');
	    		}
	    		
	    	} catch(e){
	    		ExceptionHandler(e);
	    		return;
	    	}
	    	
            objectToClear.each(function(k, v) {
                v.defaultValue = $(v).val();
            });
            
            objectToClear.bind('focus', function(event){
                var target = $(this);
                if( target.val() == target[0].defaultValue ){
                    target.val(''); 
                } 
            }).bind('blur', function(event){
                var target = $(this);
                if( target.val() == '' ){
                    target.val( target[0].defaultValue );
                }
            });
        },

        /**
         * Disable tag for: focus, keypress and click
         * 
         * @param object objectToDisable JQuery Object to disable
         * @return void
         */
        disable: function( objectToDisable ){
        	
        	try {

        		if(objectToDisable == undefined){
        			throw new Error('Variable do not exists');
        		}
        		
        		if(objectToDisable.constructor != Object){
        			throw new Error('Variable type is not right');
        		}
        		
        	} catch(e){
        		ExceptionHandler(e);
        		return;
        	}
        	
            objectToDisable.bind('focus keypress click',function(e){
                return false;
            });
        },
        
        /**
         * Special chars to trim
         */
        chars: [ ' ', '-', '_' ],
        
        /**
         * Left word trim
         * 
         * @param string word Word to trim
         * @return string word
         */
        ltrim: function( word ){
        	
        	try {

        		if(word == undefined){
        			throw new Error('Variable do not exists');
        		}
        		
        		if(word.constructor != String){
        			throw new Error('Variable type is not right');
        		}
        		
        	} catch(e){
        		ExceptionHandler(e);
        		return;
        	}
            
            for( var i = 0; i < this.chars.length; ++i ){
                while( true ){
                    if( word.substr(0,1) == this.chars[i] ) {
                        word =  word.substr(1);
                    } else {
                        return word;
                    }
                }
            };
            
            return word;
        },
        
        /**
         * Right word trim
         * 
         * @param string word Word to trim
         * @return string word
         */
        rtrim: function( word ){

        	try {

        		if(word == undefined){
        			throw new Error('Variable do not exists');
        		}
        		
        		if(word.constructor != String){
        			throw new Error('Variable type is not right');
        		}
        		
        	} catch(e){
        		ExceptionHandler(e);
        		return;
        	}

            for( var i = 0; i < this.chars.length; ++i ){
                while( true ){
                    if( word.substr( word.length - 1 ) == this.chars[i] ) {
                        word = word.substr( 0, word.length - 1 );
                    } else {
                        return word;
                    }
                }
            };
            
            return word;
        },
        
        /**
         * Bilateral word trim
         * 
         * @param string word Word to trim
         * @return string word
         */
        trim: function( word ){

        	try {

        		if(word == undefined){
        			throw new Error('Variable do not exists');
        		}
        		
        		if(word.constructor != String){
        			throw new Error('Variable type is not right');
        		}
        		
        	} catch(e){
        		ExceptionHandler(e);
        		return;
        	}
        	
            return this.ltrim( this.rtrim( word ) );
        }

    },
    
    /**
     * Object to manage glass over document in browser window
     */
    glass: {
        
        /**
         * Html glass object 
         */
        htmlObject: $('<div id="glass"></div>'),
        
        /**
         * Opacity level
         */
        opacity: 0.5,
        
        /**
         * Glass show 
         */
        show: function(){
    		
            if( $('body').find('#glass').length == 0 ){
            	
            	window.scroll(0, 0);
            	
                var maxWidth = $(window).width();
                var maxHeight = $(window).height();

                if( $(document).width() > maxWidth ){
                    maxWidth = $(document).width();
                }
                if( $(document).height() > maxHeight ){
                    maxHeight = $(document).height();
                }
                
                this.htmlObject.css({
                	height: maxHeight + "px",
                	width: maxWidth + "px",
                	overflow: 'hidden',
                	opacity: this.opacity 
            	});
                
                $('body').append( this.htmlObject );
                
            }
            this.htmlObject.fadeIn().removeClass('hide');
        },
        
        /**
         * Glass hide
         */
        hide: function(){
            this.htmlObject.fadeOut().addClass('hide').remove();
        }
    },
    
    /**
     * Object to manage loader 
     */
    loader: {
        
        /**
         * Html loader object
         */
        htmlObject: $('<div id="ajax-loader"><img src="' + DOMAIN + DS + 'img' + DS + 'popup-window' + DS + 'ajax-loader.gif" alt="Loading..." /></div>'),
        
        /**
         * Show loader 
         */
        show: function(){
    		if( $('body').find('#ajax-loader').length == 0 ){

                $('body').append( this.htmlObject );
                
                var heightLoader = 32;
                var widthLoader = 32; 
                
                //Window
                var winHeight = $(window).height();
                var winWidth = $(window).width();
                
                //Mask
                var topLoader = ( winHeight - heightLoader )/2;
                var leftLoader = ( winWidth - widthLoader )/2;
                
                this.htmlObject.css({
                    position: "absolute",
                    top: topLoader + "px",
                    left: leftLoader + "px",
                    width: widthLoader + "px", 
                    height: heightLoader + "px",
                    zIndex: "10002"
                }).fadeIn();

    		}
            this.htmlObject.fadeIn().removeClass('hide');
        },
        
        /**
         * Hide loader
         */
        hide: function() {
            $("#ajax-loader").fadeOut().addClass('hide').remove();
        }
    },
  
    /**
     * Object to manage popup in browser
     */
    popup: {
        
        content: null,
        type: null,

        htmlObject: $('<div class="popup-window"><div class="popup-manager"><a href="#popup-close" class="popup-close button">x</a><a href="#popup-previous" class="popup-previous button hide">/</a><a href="#popup-maximalize" class="popup-maximalize button">+</a><a href="#popup-minimalize" class="popup-minimalize button">-</a></div><div class="popup-content"></div></div>'),
        
        width: 300,
        height: 0,
        
        positionX: 0,
        positionY: 0,
        
        bind: function(){
        
            __self = this;
        
            this.htmlObject.find('.popup-manager .popup-close.button').bind('click', function(){
                __self.hide();
            });
            this.htmlObject.find('.popup-manager .popup-minimalize.button').bind('click', function(){
                __self.minimalize();
            });
            this.htmlObject.find('.popup-manager .popup-maximalize.button').bind('click', function(){
                __self.maximalize();
            });
            this.htmlObject.find('.popup-manager .popup-previous.button').bind('click', function(){
                __self.previous();
            });
        },
        
        setContent: function( content ){
            if( content != undefined ){
                this.content = content;
            }
        },
        
        setType: function( type ){
            if( type != undefined ){
                this.type = type;
            }
        },
            
        show: function(){
        	
            if( this.type == null ){
                this.content = '<em>Widow Popup</em> <br />';
                this.content += 'Autor: <strong>' + pklib._autor + '</strong><br />';
                this.content += 'Wersja: <strong>'+ pklib._version + '</strong><br />';
                this.content += 'Ostatnia modyfikacja: <strong>' + pklib._lastModified + '</strong>';
            }
            
            pklib.glass.show();
            
            this.htmlObject.find('.popup-content').html( this.content );
            $('body').append( this.htmlObject );
            
//            this.width = this.htmlObject.width();
            this.height = this.htmlObject.height();
            
            //Document
            var docWidth = $(document).width();
            var docHeight = $(document).height();
            
            //Window
            var winWidth = $(window).width();
            var winHeight = $(window).height();
            
            //Mask 
            var localWidth = winWidth - this.width;
            var localHeight = winHeight - this.height;
            
            this.positionX = ( localWidth )/2;
            this.positionY = ( localHeight )/2;
            
            this.htmlObject.css({
                position: 'fixed',
                width: this.width + 'px',
                top: this.positionY + 'px',
                left: this.positionX + 'px'
            }).fadeIn();
            
            this.bind();
        },

        hide: function(){
            this.htmlObject.fadeOut().addClass('hide');
            pklib.glass.hide();
        },
        
        time: 2000,
        
        setAutoHideTime: function( setTime ){
            if( setTime != undefined ){
                this.time = setTime;
            }
        },

        autohide: function(){
            
            var __self = this;
            
            setTimeout( function(){
                __self.htmlObject.fadeOut().addClass('hide');
                pklib.glass.hide();
            }, this.time);
            
        },
        
        minimalize: function(){
            
            var top = 2;
            var left = 2;
            
            var height = this.htmlObject.find('.popup-manager').height();
            var width = 200;
            
            this.htmlObject.css({
                top: top + 'px',
                left: left + 'px',
                height: height + 'px',
                width: width + 'px',
                overflow: 'hidden'
            });
            this.htmlObject.find('.popup-manager .popup-maximalize.button').addClass('hide');
            this.htmlObject.find('.popup-manager .popup-previous.button').removeClass('hide');
            this.htmlObject.find('.popup-manager .popup-minimalize.button').addClass('hide');
        },
        
        maximalize: function(){
            this.htmlObject.css({
                top: '0px',
                left: '0px',
                height: '100%',
                width: '100%'
            });
            this.htmlObject.find('.popup-manager .popup-maximalize.button').addClass('hide');
            this.htmlObject.find('.popup-manager .popup-previous.button').removeClass('hide');
            this.htmlObject.find('.popup-manager .popup-minimalize.button').removeClass('hide');
        },
        
        previous: function(){
        	
            this.htmlObject.css({
                top: this.positionY + 'px',
                left: this.positionX + 'px',
                height: this.height + this.htmlObject.find('.popup-manager').height() + 'px',
                width: this.width + 'px'
            });
            this.htmlObject.find('.popup-manager .popup-maximalize.button').removeClass('hide');
            this.htmlObject.find('.popup-manager .popup-previous.button').addClass('hide');
            this.htmlObject.find('.popup-manager .popup-minimalize.button').removeClass('hide');
        }
    },
    

    browser: {
        
        // Get browser name
        getName: function(){
    		if( $.browser.safari == true ){
    			return 'safari';
    		} else if( $.browser.opera == true ){
    			return 'opera';
    		} else if( $.browser.msie == true ){
    			return 'msie';
    		} else if( $.browser.mozilla == true ){
    			return 'mozilla';
    		}
    		return null;
        },
        
        // Get browser version
        getVersion: function(){
            return $.browser.version;
        }
            
    },
    
    /**
     * Object to manage joins file on site
     */
    file: {
        
        /**
         * Append file do choose section
         * 
         * @param string tag script|link
         * @param string src Link to file
         * @param string type text/javascript|text/css
         * @param string section head|body|special area
         */
        add: function( tag, src, type, section ){
            
            if( tag == undefined ){
                return false;
            }
            
            if( src == undefined ){
                return false;
            }
            
            if( type == undefined ){
                return false;
            } 
            
            if( section == undefined ){
                section = 'head';
            } 
            
            var file = document.createElement( tag );
            file.src = src;
            file.type = type;
            
            document.getElementsByTagName( section )[0].appendChild(file);
            
        }
    }

};
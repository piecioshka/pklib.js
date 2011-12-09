/**
 * Private Library
 * Library helped to useful things.
 * 
 * Library use jQuery 1.x.x
 *
 * Copyright (c) 2010 Piotr Kowalski (piecioshka.pl)
 * License GNU  
 * 
 * @author Piotr Kowalski <piotr.kowalski@piecioshka.pl>
 * 
 */

if( DOMAIN == undefined ){
    var DOMAIN = '.';
}

/**
 * New Instance
 */
var pklib = {

    _autor: "Piotr Kowalski",
    _version: "0.5.0",
    _lastModified: "2010/04/19",

    /**
     * Open link in new window
     * 
     * @param place string
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
     * @param object JQuery object
     * @param text Text in confirmation window
     */
    confirm: function( object, text ) {
        var go = false;
        
        if( text == undefined ){
            text = "Czy potwierdzasz akcję?";
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
            if( objectToClear == undefined || !objectToClear ){
                return false;
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
            if( objectToDisable == undefined ){
                return false;
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
            if( typeof word != "string" ){
                return false;
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
            if( typeof word != "string" ){
                return false;
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
            if( typeof word != "string" ){
                return false;
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
                
                var maxWidth = 0;
                var maxHeight = 0;

                maxWidth = window.innerWidth;
                if( $(document).width() > window.innerWidth ){
                    maxWidth = $(document).width();
                }
                maxHeight = window.innerHeight;
                if( document.height > window.innerHeight ){
                    maxHeight = document.height;
                }
                
                this.htmlObject.css('height', maxHeight );
                this.htmlObject.css('width', maxWidth );
                this.htmlObject.css('opacity', this.opacity );
                
                $('body').append( this.htmlObject );
            }
            this.htmlObject.fadeIn().removeClass('hide');
        },
        
        /**
         * Glass hide
         */
        hide: function(){
            this.htmlObject.fadeOut().addClass('hide');
        }
    },
    
    /**
     * Object to manage loader 
     */
    loader: {
        
        /**
         * Html loader object
         */
        htmlObject: $('<div id="ajax-loader"><img src="' + DOMAIN + '/img/popup-window/ajax-loader.gif" alt="Loading..." /></div>'),
        
        /**
         * Show loader 
         */
        show: function(){
            
            $('body').append( this.htmlObject );
            
            var height = 32;
            var width = 32; 
            
            var top = ( window.innerHeight - height )/2;
            var left = ( window.innerWidth - width )/2;

            this.htmlObject.css({
                position: "absolute",
                top: top + "px",
                left: left + "px",
                width: width + "px", 
                height: height + "px",
                zIndex: "10002"
            }).fadeIn();
            
        },
        
        /**
         * Hide loader
         */
        hide: function() {
            $("#ajax-loader").fadeOut();
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
        
        maxWidth: 0,
        maxHeight: 0,
        
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
            if( this.type == "test" ){
                this.content = '<em>Widow Popup</em> <br />';
                this.content += 'Autor: <strong>' + pklib._autor + '</strong><br />';
                this.content += 'Wersja: <strong>'+ pklib._version + '</strong><br />';
                this.content += 'Ostatnia modyfikacja: <strong>' + pklib._lastModified + '</strong>';
            }
            
            pklib.glass.show();
            
            this.htmlObject.find('.popup-content').html( this.content );
            $('body').append( this.htmlObject );
            
            this.maxWidth = $(document).width();
            if( window.innerWidth > $(document).width() ){
                this.maxWidth = window.innerWidth;
            }
            this.maxHeight = document.height;
            if( window.innerHeight > document.height ){
                this.maxHeight = window.innerHeight;
            }
            
            this.height = this.htmlObject.height();
            this.width = this.htmlObject.width();
            
            var localWidth = window.innerWidth - this.width;
            if( localWidth < 0 ){
                localWidth = this.maxWidth - this.width;
            }
            if( localWidth < 0 ){
                localWidth = this.width - this.maxWidth;
            }
            
            var localHeight = window.innerHeight - this.height;
            if( localHeight < 0 ){
                localHeight = this.maxHeight - this.height;
            }
            if( localHeight < 0 ){
                localHeight = this.height - this.maxHeight;
            }
            
            this.positionX = ( localWidth )/2;
            this.positionY = ( localHeight )/2;
            
            this.htmlObject.css({
                position: 'absolute',
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
            pklib.glass.hide();
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
            pklib.glass.show();
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

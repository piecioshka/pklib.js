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

/**
 * New Instance
 */
var pklib = {

    _autor: "Piotr Kowalski",
    _version: "0.4.3",
    _lastModified: "2010/04/09",

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
    
    confirm: function( object, text ) {
        var go = false;
        
        if( text == undefined ){
            text = "Czy potwierdzasz akcjÄ?";
        }
        
        object.bind('click', function() {
            go = confirm( text );
            if( go == true ){
                window.location = $(this).attr('href');
                return true;
            } else {
                return false;
            }           
        });
        
    },

    content:{
    
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

        disable: function( objectToDisable ){
            if( objectToDisable == undefined ){
                return false;
            }
            objectToDisable.bind('focus keypress click',function(e){
                return false;
            });
        },
        
        ltrim: function( word ){
            if( typeof word != "string" ){
                return false;
            }
            if( word.substr(0,1) == ' ' ) {
                return word.substr(1);
            }
            return word;
        },
        
        rtrim: function( word ){
            if( typeof word != "string" ){
                return false;
            }
            if( word.substr( word.length - 1 ) == ' ' ) {
                return word.substr( 0, word.length - 1 );
            }
            return word;
        },
        
        trim: function( word ){
            if( typeof word != "string" ){
                return false;
            }
            return pklib.content.ltrim( pklib.content.rtrim( word ) );
        }

    },
    
    glass:{
        
        htmlObject:$('<div id="glass"></div>'),

        maxWidth:0,
        maxHeight:0,
        
        show: function(){
            if( $('body').find('#glass').length == 0 ){

                pklib.glass.maxWidth = $(window).width();
                if( $(document).width() > $(window).width() ){
                    pklib.glass.maxWidth = $(document).width();
                }
                pklib.glass.maxHeight = $(window).height();
                if( $(document).height() > $(window).height() ){
                    pklib.glass.maxHeight = $(document).height();
                }
                
                pklib.glass.htmlObject.css('height', pklib.glass.maxHeight );
                pklib.glass.htmlObject.css('width', pklib.glass.maxWidth );
                pklib.glass.htmlObject.css('opacity', 0.5 );
                
                $('body').append( pklib.glass.htmlObject );
            }
            pklib.glass.htmlObject.fadeIn().removeClass('hide');
        },
        hide: function(){
            pklib.glass.htmlObject.fadeOut().addClass('hide');
        }
    },
    
    loader: {
        
        htmlObject: $('<div id="ajax-loader" ><img src="images/popup-window/ajax-loader.gif" alt="Loading..." /></div>'),
        
        show: function(){
            
            $('body').append( pklib.loader.htmlObject );

            pklib.loader.htmlObject.css({
                top: ($(window).height() - pklib.loader.htmlObject.height() )/2 + 'px',
                left: ($(window).width() - pklib.loader.htmlObject.width() )/2 + 'px'
            }).fadeIn();
        },
        hide: function() {
            $("#ajax-loader").fadeOut();
        }
    },
  
    popup:{
        
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
            pklib.popup.htmlObject.find('.popup-manager .popup-close.button').bind('click',function(){
                pklib.popup.hide();
            });
            pklib.popup.htmlObject.find('.popup-manager .popup-minimalize.button').bind('click',function(){
                pklib.popup.minimalize();
            });
            pklib.popup.htmlObject.find('.popup-manager .popup-maximalize.button').bind('click',function(){
                pklib.popup.maximalize();
            });
            pklib.popup.htmlObject.find('.popup-manager .popup-previous.button').bind('click',function(){
                pklib.popup.previous();
            });
        },
        
        setContent: function( content ){
            if( content != undefined ){
                pklib.popup.content = content;
            }
        },
        
        setType: function( type ){
            if( type != undefined ){
                pklib.popup.type = type;
            }
        },
            
        show: function(){
            if( pklib.popup.type == "test" ){
                pklib.popup.content = '<strong>Widow Popup</strong> <br />Autor: ' + pklib._autor + '<br />Wersja: '+ pklib._version + '<br />Ostatnia modyfikacja: ' + pklib._lastModified;
            }
            
            pklib.glass.show();
            
            pklib.popup.htmlObject.find('.popup-content').html( pklib.popup.content );
            $('body').append( pklib.popup.htmlObject );
            
            pklib.popup.maxWidth = $(document).width();
            if( $(window).width() > $(document).width() ){
                pklib.popup.maxWidth = $(window).width();
            }
            pklib.popup.maxHeight = $(document).height();
            if( $(window).height() > $(document).height() ){
                pklib.popup.maxHeight = $(window).height();
            }
            
            pklib.popup.height = pklib.popup.htmlObject.height();
            pklib.popup.width = pklib.popup.htmlObject.width();
            
            var localWidth = $(window).width() - pklib.popup.width;
            if( localWidth < 0 ){
                localWidth = pklib.popup.maxWidth - pklib.popup.width;
            }
            if( localWidth < 0 ){
                localWidth = pklib.popup.width - pklib.popup.maxWidth;
            }
            
            var localHeight = $(window).height() - pklib.popup.height;
            if( localHeight < 0 ){
                localHeight = pklib.popup.maxHeight - pklib.popup.height;
            }
            if( localHeight < 0 ){
                localHeight = pklib.popup.height - pklib.popup.maxHeight;
            }
            
            pklib.popup.positionX = ( localWidth )/2;
            pklib.popup.positionY = ( localHeight )/2;
            
            pklib.popup.htmlObject.css({
                position:'absolute',
                width: pklib.popup.width + 'px',
                top: pklib.popup.positionY + 'px',
                left: pklib.popup.positionX + 'px'
            }).fadeIn();
            
            pklib.popup.bind();
        },

        hide: function(){
            pklib.popup.htmlObject.fadeOut().addClass('hide');
            pklib.glass.hide();
        },
        
        minimalize: function(){
            pklib.popup.htmlObject.css({
                top:'2px',
                left:'2px',
                height:'21px',
                width:'200px',
                overflow:'hidden'
            });
            pklib.popup.htmlObject.find('.popup-manager .popup-maximalize.button').addClass('hide');
            pklib.popup.htmlObject.find('.popup-manager .popup-previous.button').removeClass('hide');
            pklib.popup.htmlObject.find('.popup-manager .popup-minimalize.button').addClass('hide');
            pklib.glass.hide();
        },
        
        maximalize: function(){
            pklib.popup.htmlObject.css({
                top:'0px',
                left:'0px',
                height:'100%',
                width:'100%'
            });
            pklib.popup.htmlObject.find('.popup-manager .popup-maximalize.button').addClass('hide');
            pklib.popup.htmlObject.find('.popup-manager .popup-previous.button').removeClass('hide');
            pklib.popup.htmlObject.find('.popup-manager .popup-minimalize.button').removeClass('hide');
        },
        
        previous: function(){
            pklib.popup.htmlObject.css({
                top: pklib.popup.positionY + 'px',
                left: pklib.popup.positionX + 'px',
                height: pklib.popup.height + pklib.popup.htmlObject.find('.popup-manager').height() + 'px',
                width: pklib.popup.width + 'px'
            })
            pklib.popup.htmlObject.find('.popup-manager .popup-maximalize.button').removeClass('hide');
            pklib.popup.htmlObject.find('.popup-manager .popup-previous.button').addClass('hide');
            pklib.popup.htmlObject.find('.popup-manager .popup-minimalize.button').removeClass('hide');
            pklib.glass.show();
        }
    },
    
    file: {
        
        /**
         * Add file do <head> section
         * 
         * @param tag script|link
         * @param src Link to file
         * @param type text/javascript|text/css
         */
        add: function( tag, src, type ){
            
            if( tag == undefined ){
                return false;
            }
            
            if( src == undefined ){
                return false;
            }
            
            if( type == undefined ){
                return false;
            } 
            
            var file = document.createElement( tag );
            file.src = src;
            file.type = type;
            
            document.getElementsByTagName("head")[0].appendChild(file);
            
        }
    }

};

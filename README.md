CAUTION: DO NOT USE THIS

I'm still adapting this code a lot. Given what it does, it is likely to become a core part of any code you use it in. And if I then make a little change, you will have to refactor or worse rewrite your code.


example:

var ext = require( 'Extendable' ) ;

var obj = {} ;
obj.func   = function( x ) { console.log( 'func ' + x ) ; } ;
var listen = function( x ) { console.log( 'listen ' + x ) ; } ;

ext.after( obj, 'func', listen ) ;

obj.func( 'bla' ) ;

OUTPUT:

func bla
listen bla






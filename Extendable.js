// define( ['require', 'exports', 'Util/dbg.js' ], function (require, exports, dbg ) {



var returnUndefined = {} ;

exports.returnUndefined = returnUndefined ;

function ReturnImmediately( value )
    {
     this.value = value ;
    }


function extendableFunction( f )
	{
	 var processBefore = new Array() ;
	 var processAfter  = new Array() ;



	 var extended = function() 
		{
        
        
         try
            {
             for( var i = processBefore.length - 1 ; i >= 0 ; i-- )	
                processBefore[ i ].apply( this, arguments) ; 
            }
         catch( e )
            {
             if( e instanceof ReturnImmediately ) 
                {
                 return e.value ;
                 
                }
            }

         

         var returnMe  = f.apply( this, arguments) ;          
         
         
         var argsAsArray = [] ;
                  
         for( var i = 0 ; i < arguments.length ; ++i )
            {
             argsAsArray[ i ] =( arguments[ i ] ) ;
            }
            
         argsAsArray[ argsAsArray.length ] = returnMe ;
         
         
         var returnValueAfter ;
         
		 for( var j = 0 ; j < processAfter.length ; j++  ) 
			{
                          
             if( processAfter[ j ].length == f.length + 1 )
                returnValueAfter = processAfter[ j ].apply( this, argsAsArray ) ;
             else
                returnValueAfter = processAfter[ j ].apply( this, arguments ) ;
                
             if( returnValueAfter === returnUndefined )
                {
                 argsAsArray[ argsAsArray.length - 1 ] = undefined ;
                }
             else if( returnValueAfter === 'undefined' )
                {
                 continue ;
                }
             else 
                {
                 argsAsArray[ argsAsArray.length - 1 ] = returnValueAfter ;
                }
             /*
             if( processAfter[ j ].changesReturn )
                {
                 argsAsArray[ argsAsArray.length - 1 ] =  
                }
             else
                processAfter[ j ].apply( this, argsAsArray ) ; 
                
             */
			}
            
	 	 return argsAsArray[ argsAsArray.length - 1 ]  ;
		}



	 extended.processBefore = processBefore ;
	 extended.processAfter  = processAfter  ;

	 extended.f = f ;
 
	 extended.isExtended = 1 ;

	

	 extended.addAfter = function( next )
		{
		 processAfter.push( next ) ;
		}


	 extended.removeAfter = function( next )
		{
		 var i = processAfter.indexOf( next ) ;
		 if( i == -1 )
			return 0 ;

		 processAfter.splice( i, 1 ) ;
         

		 return 1 ;
		}

	 extended.addBefore = function( first )
		{
		 processBefore.push( first ) ;
		}

	 extended.removeBefore = function( first )
		{
		 var i = processBefore.indexOf( first ) ;
		 if( i == -1 )
			return 0 ;
         
         delete processBefore[ i ];
         
		 return 1 ;
		}


	 return extended ;
	}


function Extendable()
    {}
    

Extendable.prototype.after = function( callName, next )
	{
    
	 var f = this[ callName ] ;
	 if( !f.isExtended ) this[ callName ] = extendableFunction( this[ callName ] ) ;
	 
	 this[ callName ].addAfter( next ) ;
	}


Extendable.prototype.before = function( callName, first )
	{

	 var f = this[ callName ] ;
	 if( !f.isExtended ) this[ callName ] = extendableFunction( this[ callName ] ) ;
	 
	 this[ callName ].addBefore( first ) ;
	}
    
    
Extendable.prototype.nameCall = function( name )
    {
     var self = this ;
     
     var argArray = new Array( self[ name ].length ) ;
     
     for( var i = 0 ; i < argArray.length ; i++ )
        argArray[ i ] = 'a' + i ;
     
     var body = 'self[ name ].apply( self, arguments ) ;' ;
     
     // argArray.push( body ) ;
     
     var theNameCall ;
     
     eval( 'theNameCall = function( ' + argArray.toString() + ') { ' + body + ' } ; ' ) ;
     
    // var theNameCall = Function.apply( self, argArray ) ;
     
    
     return  theNameCall ; // function() { dbg.puts( 'name call ' + name + ' arguments ' + arguments.length ) ; self[ name ].apply( self, arguments ) ; } ;
    
    }

exports.Extendable = Extendable ;

//} ) ;
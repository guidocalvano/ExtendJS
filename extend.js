


var returnUndefined = {} ;

exports.returnUndefined = returnUndefined ;

function ReturnImmediately( value )
    {	
     this.value = value ;
    }

function printNameCall( nc )
	{
	 console.log( nc.object.constructor.name + '.' + nc.callName ) ;
	}

function printCallSequence( b, a )
	{
	 console.log( 'EXTENDED CALLSEQUENCE' ) ;
		
     for( var i = b.length - 1 ; i >= 0 ; i-- )	
		printNameCall( b[ i ] ) ;
		
	 console.log( 'original function' ) ;
		
	 for( var j = 0 ; j < a.length ; j++  ) 
		printNameCall( a[ j ] ) ;

     console.log( 'END EXTENDED CALLSEQUENCE' ) ;
     
	}

function extendableFunction( f )
	{
	 var processBefore = new Array() ;
	 var processAfter  = new Array() ;



	 var extended = function() 
		{
         printCallSequence( processBefore, processAfter ) ; 
        
         try
            {
             for( var i = processBefore.length - 1 ; i >= 0 ; i-- )	
                {
                 console.log( "ACTUAL CALL " + i ) ;
                
                 printNameCall( processBefore[ i ] ) ;
                
                 processBefore[ i ].apply( this, arguments) ; 
                 
                 console.log( "ACTUAL CALL COMPLETE" ) ;
                }
            }
         catch( e )
            {
             if( e instanceof ReturnImmediately ) 
                {
                 console.log( 'RETURN IMMEDIATELY' ) ;
                        		
                 return e.value ;       
                }
            }

         

         var returnMe  = f.apply( this, arguments) ;          
     	// console.log( 'returnMe at f ' + returnMe ) ;
	    
         
         var argsAsArray = [] ;
                  
         for( var i = 0 ; i < arguments.length ; ++i )
            {
             argsAsArray[ i ] =( arguments[ i ] ) ;
            }
            
         argsAsArray[ argsAsArray.length ] = returnMe ;
         
		 console.log( 'f( ' + f.length + ' ) ' ) ;
         
         var returnValueAfter ;
         
		 for( var j = 0 ; j < processAfter.length ; j++  ) 
			{

//			 console.log( "i : " + j ) ;

             console.log( "after: " + processAfter[ j ].object.constructor.name + '.' + processAfter[ j ].callName + '( ' + processAfter[ j ].length + ' )' ) ;
/*
             console.log( "object name: " + processAfter[ j ].callName ) ;

			 console.log( "arg count : " + processAfter[ j ].length ) ;

			 console.log( "return me : " + returnMe ) ;
*/

         //    if( processAfter[ j ].length == f.length + 1 )
                returnValueAfter = processAfter[ j ].apply( this, argsAsArray ) ;
         //    else
         //       returnValueAfter = processAfter[ j ].apply( this, arguments ) ;
                
             if( returnValueAfter === returnUndefined )
                {
                 argsAsArray[ argsAsArray.length - 1 ] = undefined ;
                }
             else if( returnValueAfter === undefined )
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
           
		// console.log( 'returnMe ' + returnMe ) ;
		// console.log( 'argsAsArray[ l - 1 ] ' + argsAsArray[ argsAsArray.length - 1 ] ) ;

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

var nextKey = 1 ;
var key = function( obj )
	{
	 if( obj.____key )	
		return obj.____key ;
	 
	 console.log( 'assigning key' ) ;
	 obj.____key = 'key' + nextKey ; nextKey++ ;
	
	 return obj.____key ;
	} ;



var nextNameCallKey = 1 ;
var nameCallKey = function( obj )
	{
	 if( obj.____nameCallKey )	
		return obj.____nameCallKey ;
	 
	 console.log( 'assigning key' ) ;
	 obj.____nameCallKey = 'key' + nextNameCallKey ; nextNameCallKey++ ;
	
	 return obj.____nameCallKey ;
	} ;

var createNameCall = function( obj, name )
	{
   	 var theNameCall ;
	
	 var argArray = new Array( obj[ name ].length ) ;

     for( var i = 0 ; i < argArray.length ; i++ )
        argArray[ i ] = 'a' + i ;

     var body = 'obj[ name ].apply( obj, arguments ) ;' ;

     // argArray.push( body ) ;


     eval( 'theNameCall = function( ' + argArray.toString() + ') { ' + body + ' } ; ' ) ;

	 theNameCall.object = obj  ;
	 theNameCall.callName   = name ;
     theNameCall.keyString = key( obj ) ;
	 

	 return theNameCall ;
	}

var nameCall = function( obj, name, mustRemove )
    {     

   	 var theNameCall ;

	 if(  !( obj[ name ][ nameCallKey( obj ) ] )  ) 
		{	    
		 theNameCall = createNameCall( obj, name ) ;
	 	 obj[ name ][ nameCallKey( obj ) ] = theNameCall ;
		 theNameCall.refCount = 1 ;
		}
	 else
		{
		 theNameCall = obj[ name ][ nameCallKey( obj ) ] ;
		
		 if( mustRemove ) 
		 	{
			 theNameCall.refCount-- ;
			 if( theNameCall.refCount == 0 )
				delete obj[ name ][ nameCallKey( obj ) ] ;
			}
		 else
		 	theNameCall.refCount++ ;			
		
		}

     return  theNameCall ; // function() { dbg.puts( 'name call ' + name + ' arguments ' + arguments.length ) ; self[ name ].apply( self, arguments ) ; } ;

    }

var after = function( obj, callName, nextObj, nextCallName )
	{
     console.log( 'after ' + obj.constructor.name + '.' + callName + ' ' + nextObj.constructor.name + '.' + nextCallName ) ;

	 var f = obj[ callName ] ;
	 if( !f.isExtended ) obj[ callName ] = extendableFunction( obj[ callName ] ) ;

	 obj[ callName ].addAfter( nameCall( nextObj, nextCallName ) ) ;
	
	}


var before = function( obj, callName, firstObj, firstCallName )
	{
	
	 var f = obj[ callName ] ;
	 if( !f.isExtended ) obj[ callName ] = extendableFunction( obj[ callName ] ) ;

	 obj[ callName ].addBefore( nameCall( firstObj, firstCallName ) ) ;	
	}
 



var removeAfter = function( obj, callName, nextObj, nextCallName )
	{
	 obj[ callName ].removeAfter( nameCall( nextObj, nextCallName, true ) ) ;
	}


var removeBefore = function( obj, firstObj, firstCallName )
	{
	 obj[ callName ].removeBefore( nameCall( firstObj, firstCallName, true ) ) ;

	}


var getEmbedded = function( obj, keyContainer )
	{
     console.log( 'embedded' ) ;
    
	 if( !obj.____embedded ) return undefined ;
	
     for( var i in obj.____embedded ) console.log( 'key ' + i + ' ent ' + obj.____embedded ) ;
     
     console.log( 'key func ' + key( keyContainer ) ) ;
    
	 return obj.____embedded[ key( keyContainer ) ] ;
	} ;

var setEmbedded = function( obj, keyContainer, embedded )
	{
	 if( ! obj.____embedded ) obj.____embedded = {} ;
		
	 obj.____embedded[ key( keyContainer ) ] = embedded ;
	} ;


exports.after    			= after   			 ;
exports.before   			= before  			 ;
exports.nameCall 			= nameCall			 ;
exports.ReturnImmediately 	= ReturnImmediately	 ;
exports.key		 		 	= key 				 ;
exports.setEmbedded			= setEmbedded		 ;
exports.getEmbedded			= getEmbedded		 ;
exports.nameCallKey		 	= nameCallKey		 ;

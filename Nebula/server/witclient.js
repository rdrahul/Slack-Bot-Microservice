const request = require('superagent');
let TOKEN  = null;

let WitResponseHandler = ( res) => {
    console.log( res);
    return res.entities;
}

let ask = ( message ) => {
    console.log( 'ask : ' + message );
    console.log(`token : ${TOKEN}`);
    const url = "https://api.wit.ai/message"; 
    return new Promise(( resolve , reject ) => {
        
        //make the request to wit api
        request( url )
        .set('Authorization' , 'Bearer ' + TOKEN)
        .query( { v :20181024 } )
        .query( { q : message  })
        .end( ( err , res  ) => {
            if (err)   
                reject(err);
            if ( res.statusCode != 200 ) 
                reject( "Response code not 200 got instead " + res.statusCode)
            
            const WitResponse = WitResponseHandler( res.body);
            resolve( WitResponse);

        } )
    } );
    
}

let WitClient = ( token ) => {
    TOKEN = token;
    return {
        ask : ask
    }
}


module.exports = WitClient;
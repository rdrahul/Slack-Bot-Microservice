const request = require('superagent');
class TimeIntent {

    constructor(){}

    process( witObj  ){
        return new Promise(  (resolve , reject) => { 

            
            //no location is specified
            if ( ! witObj.location){
                reject( "Sorry! Didn't get the location." );
            }

            const location = witObj.location[0].value;

            request.get(`http://localhost:3001/service/${location}` , (err , res ) => {
                if ( err || res.statusCode != 200 || !res.body.result ){
                    console.log( err);
                    console.log( res.body);
                    
                    resolve( `I have problem finding out the time in ${location}`);
                }

                resolve(`In ${res.body.location}, it is now ${res.body.result}`);
            });

        });
    }

}

module.exports = TimeIntent;
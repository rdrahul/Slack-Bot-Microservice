const TimeIntent = require ('./time.intent');

class Intent {

    static ProcessIntent( intent) {
        console.log("Here inside intent");        
        switch( intent) {
            case 'time' : 
                return new TimeIntent();
            default:
                throw new Error( "No Intent class found");
        }

    }
}

module.exports = Intent;
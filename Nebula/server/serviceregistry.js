'use strict'

class ServiceRegistry{
    constructor(){
        this._services = {};
        this._timeout = 30;
    }

    add(intent , ip, port ){
        const key = intent + ip + port ;

        if ( !this._services[key]){
            this._services[key] = { 
                timestamp : Math.floor( new Date() / 1000) ,
                ip : ip,
                port :port ,
                intent : intent
            };
            console.log( `Added service for intent ${intent} on ${ip} : ${port}`);
            return;
        }

        
        this._services[key].timestamp = Math.floor( new Date() / 1000);
        console.log( `Updated service for intent ${intent} on ${ip} : ${port}`)
    }

    remove( intent , ip , port){
        const key  = intent + ip + port;
        delete this._services[key];
    }

    get(intent){
        for( let key in this._services){
            if ( this._services[key].intent == intent  ) return this._services[key]; 
        }

        return null;
    }

    _cleanup(){
        const now = Math.floor( new Date()/ 1000 );

        for ( let key in this._services ){
            if ( this._services[key].timestamp + this._timeout < now  ){
                console.log( `Removed Service for intent ${this._services[key].intent}`);
                delete this._services[key];
            }
        }
    }
}


module.exports = ServiceRegistry;
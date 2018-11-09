'use strict'

const service  = require('../server/service');
const http = require('http');
const config = require('../config/conf');
const request = require('superagent');

const server = http.createServer( service );


server.listen( 3001 );

server.on('listening', function(){
    console.log( `Started Nebula timesheet service on port : ${server.address().port} in ${service.get('env')} mode` );


    //let the main service know that this service is alive
    const announce = function(){
        
        let url =`http://localhost:3000/service/time/${server.address().port}`;
        request.put(url )
            .then( resp => {
                console.log( resp.body);
            } , err => {
                console.log("Main server is not reachable" , err);
            } )
    }

    announce();
    setInterval( announce , 15000);

});
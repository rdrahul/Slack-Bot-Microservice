'use strict'

const service  = require('../server/service');
const http = require('http');
const config = require('../config/conf');
const WitClient = require('../server/witclient')(config.WIT);
const SlackClient  = require('../server/slackclient');

const SlackLogLevel = 'info';

const Rtm = SlackClient.init( config.SLACK, SlackLogLevel , WitClient );
Rtm.start();

const server = http.createServer( service );

SlackClient.add( Rtm , () => server.listen( 3000 ) );

// server.listen( 3000 );

server.on('listening', function(){
    console.log( `Started Nebula on port : ${server.address().port} in ${service.get('env')} mode` );
});
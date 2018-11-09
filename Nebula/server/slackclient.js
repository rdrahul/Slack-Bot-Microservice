const SlackClient = require('@slack/client');
const RTMClient = SlackClient.RTMClient;
const ClientEvents = SlackClient.ClientEvents;
const IntentResolver = require('../intents/intent.class');

let RtmServer = null;
let npl = null;

//handle the onAuthencicated event
function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, Not connected to channel yet`);
}

//whenever we receive a new message on slack this handler is invoked
let handleMessage = (message) => {
    console.log(message);

    //analyze the message and send response if we have the ans.
    npl.ask(message.text)
        .then((resolvedMessage) => {

            try {
                console.log(resolvedMessage.intent);
                //check if we got the intent from the resolved message return from wit api.
                if ( !resolvedMessage.intent || !resolvedMessage.intent[0] || !resolvedMessage.intent[0].value){
                    throw new Error('Could not extract Intent');
                }

                /**
                 * Intent Resolved resolves which intent is passed and returns corresponding class object for that intent.
                 */
                let intent = IntentResolver.ProcessIntent( resolvedMessage.intent[0].value );
                intent.process( resolvedMessage )
                    .then( (response) => {
                        console.log("Lock -- ");
                        RtmServer.sendMessage(response, message.channel)
                    })
                    .catch(err => {
                        console.log("Error -- " , err );
                        RtmServer.sendMessage("Could not get what you are saying", message.channel)
                    });


            } catch (err) {
                console.log(err);
                RtmServer.sendMessage("Sorry could not understood" , message.channel );
            }



        })
        .catch((err) => {
            console.log(err);
            RtmServer.sendMessage("Sorry could not understood" , message.channel );
        });

}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on('authenticated', handler);
}

module.exports.init = (token, logLevel, witClient) => {
    RtmServer = new RTMClient(token, { logLevel: logLevel });
    npl = witClient;
    addAuthenticatedHandler(RtmServer, handleOnAuthenticated);
    RtmServer.on('message', handleMessage);
    return RtmServer;
}


module.exports.add = addAuthenticatedHandler;
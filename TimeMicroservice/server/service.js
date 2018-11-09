"use strict"

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

let APIKEY = require('../config/conf').GOOGLE;
//google api key 

let LOC_API = ( location , timestamp ) => `https://maps.googleapis.com/maps/api/timezone/json?location=${location}&timestamp=${timestamp}&key=${APIKEY}` ;
let GEO_API = ( location ) => `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${APIKEY}`;
//route for getting the time zone 

//:location :  the location of the place time is required for
service.get('/service/:location' , (req , res , next ) => {

    let location = req.params.location;
    request.get( GEO_API(location)  )
        .then( 
            (response) => {
                let respon =  response.body.results[0].geometry.location;
                let lat = respon.lat;
                let lng = respon.lng;
                let geolocation = `${lat},${lng}`;
                let timestamp = +moment().format('X');

                console.log(LOC_API( geolocation ,timestamp ));
                request.get( LOC_API( geolocation, timestamp ) )
                    .then( 
                        (timeResp) => {
                            const result  = timeResp.body ;
                            const timestring = moment.unix( timestamp + result.dstOffset + result.rawOffset).utc().format( 'dddd, MMMM Do YYYY, h:mm:ss a'); 
                            return res.status( 200 ).send( {result : timestring , location :  response.body.results[0].address_components[0].long_name } );
                        },
                        (err) => { 
                            return res.status(500).json({message : "error in timezone api"});
                        })


                //return res.status(200).json( );
            }, 
            (err) => {
                return res.sendStatus(500);
            }  )

    
});

module.exports = service;
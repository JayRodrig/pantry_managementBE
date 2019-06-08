// NPM MODULES
const express = require('express');

// LOCAL MODULES
const { upcomingMealsIngList, } = require('../services/shopping_list');
const config = require('../services/twilio/config.js')
const client = require('twilio')(config.acc_sid, config.acc_token);

//SEND SMS
const sendSMS = async ( request, response ) => {
    const { user_id, phone_number} = request.params;
    const ingredientsList = await upcomingMealsIngList(user_id);

    const values = Object.values(ingredientsList)
    let textMessageBody = 'At least... ';
    values.forEach(e => {
        textMessageBody += `${e.needed_weight} grams of ${e.product_name} is needed. `
    })

    client.messages
        .create({
            body: textMessageBody,
            from: config.acc_number,
            to: phone_number
        })
        .then(message => {
            response.status(200).json({
                message: 'Text Message Has Been Sent',
                status: message.status
            })
        })
        .catch(err => {
            response.status(400).json({
                'msg': `Something went wrong`,
                e: err.toString(),
            });
        });
}


const getSMSRouter = _ => {
    const SMSRouter = express.Router();
    
    SMSRouter.get('/:user_id/:phone_number', sendSMS);
    
    return SMSRouter;
};

module.exports = {
    getSMSRouter,
};
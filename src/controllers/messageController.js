const { Menu } = require("../utils/menu.js")
const { sendTextMessage, sendSetup } = require("../utils/messenger.js")
const db = require("../utils/db.js")
const postbackHandler = require("../utils/postbackHandler.js")

function verifyWebhook(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.FB_WEBHOOK_VERIFY_TOKEN) {
      res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
}

function webhook(req, res){
  let data = req.body;
  if (data.object === 'page') {
    if (data.entry) {
      data.entry.forEach(function(entry) {
        let pageID = entry.id;
        let timeOfEvent = entry.time;
        if(entry.messaging) {
          entry.messaging.forEach(messagingEventHandler);
        } else {
          console.log('unknown entry',JSON.stringify(entry))
        }
      });
    } else {
      console.log('unknown webhook: ', JSON.stringify(data))
    }
  } else {
    console.log('unknown webhook: ', JSON.stringify(data))
  }
  res.sendStatus(200);
}

function messagingEventHandler(event) {
  if (event.message && event.message.text) {
    receivedMessage(event);
  } else if (event.account_linking) {
    receivedAccountLinking(event);
  } else if (event.postback) {
    receivedPostback(event);
  } else if (event.delivery) {
    messageDelivered(event)
  } else if (event.read) {
    messageRead(event)
  } else {
    console.log("unknown event: ", event);
  }
}

function receivedAccountLinking(event){
  console.log('receive account linking event:')
  console.log(JSON.stringify(event))
}

function receivedMessage(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const message = event.message;
  
  if(message.text === 's') {
    db.insertUser(senderID)
  } else if(message.text[0] === '-') {
    db.client.query(message.text.slice(1))
  }
  console.log(`message from: ${senderID} at ${timeOfMessage}: ${message.text}`)
}

function receivedPostback(event) {
  console.log('receive postback event:')
  console.log(JSON.stringify(event))
  sendTextMessage(event.sender.id, postbackHandler(event.postback.payload))
}

function messageDelivered(event) {
  console.log('message sent:', event.delivery.mids.toString(), event.delivery.watermark )
}

function messageRead(event) {
  console.log('message read:', event.read.watermark)
}


module.exports = {
  webhook,
  verifyWebhook
}
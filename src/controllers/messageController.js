const { Menu } = require("../utils/menu.js")
const { sendTextMessage, sendSetup } = require("../utils/messenger.js")
const db = require("../utils/db.js")

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
    data.entry.forEach(function(entry) {
      let pageID = entry.id;
      let timeOfEvent = entry.time;
      entry.messaging.forEach(messagingEventHandler);
    });
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
    let menu = new Menu(senderID)
    menu.addSubMenu('dice')
    menu.updateDB()
  } else if(message.text[0] === '-') {
    db.client.query(message.text.slice(1))
  }
  console.log(`message from: ${senderID} at ${timeOfMessage}: ${message.text}`)
}

function receivedPostback(event) {
  console.log('receive postback event:')
  console.log(JSON.stringify(event))
}

function messageDelivered(event) {
  console.log('message sent:', event.delivery.mids.toString(), watermark )
}

function messageRead(event) {
  console.log('message read:', event.read.watermark)
}


module.exports = {
  webhook,
  verifyWebhook
}
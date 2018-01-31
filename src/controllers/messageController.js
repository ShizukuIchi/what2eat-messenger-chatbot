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
      entry.messaging.forEach(function(event) {
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
      });
    });
  }
  res.sendStatus(200);
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
  
  let menu = new Menu()
  if(message.text === '吃') {
    menu.addSubMenu('dice')
  } else if (message.text === 'd') {
    db.getUsers().then(console.log)
    menu.setup()
  } else if(message.text === "註冊") {
    db.insertUser(senderID);
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
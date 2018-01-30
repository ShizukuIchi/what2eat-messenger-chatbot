
function verifyWebhook(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.FB_APP_SECRET) {
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
        } else {
          console.log("Webhook received unknown event: ", event);
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

  console.log(`Receive message from user: ${senderID} to page: ${recipientID} at ${timeOfMessage}:`)
  console.log(JSON.stringify(message));
}

function receivedPostback(event) {
  console.log('receive postback event:')
  console.log(JSON.stringify(event))
}

module.exports = {
  webhook,
  verifyWebhook
}
const { Menu } = require("../utils/menu.js")
const { sendTextMessage, sendSetup, sendFunctionList } = require("../utils/messenger.js")
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
      console.log(JSON.stringify(data.entry))
      data.entry.forEach(function(entry) {
        let pageID = entry.id;
        let timeOfEvent = entry.time;
        if (entry.messaging) {
          entry.messaging.forEach(messagingEventHandler);
        }
      });
    }
  }
  res.sendStatus(200);
}

function messagingEventHandler(event) {
  if (event.message) {
    if (event.message.text) {
      receivedMessage(event);
    } else if (event.message.sticker_id) {
      receivedSticker(event);
    } else {
      console.log('Receive: ',event)
    }
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
  const message = event.message;
  
  if(message.text[0] === '>') {
    db.client.query(message.text.slice(1))
      .then(res => console.log(JSON.stringify(res)))
      .catch(e => {throw e})
  } else if (message.text === 'p') {
    db.getDatasTable()
      .then(res => sendTextMessage(process.env.MY_PSID, JSON.stringify(res)))
  } else if (message.text.indexOf('新增') === 0) {
    if(message.text.indexOf('大家的') === 2) {
      const element = message.text.split('新增大家的')[1]
      if (element.length !== 0) {
        db.insertDataElements('public', element)
          .then(res => sendTextMessage(senderID, '新增完成!'))
          .catch(rej => sendTextMessage(senderID, 'Sorry，新增失敗'))
      }
    } else {
      const element = message.text.split('新增')[1]
      if (element.length !== 0) {
        db.insertDataElements(senderID, element)
          .then(res => sendTextMessage(senderID, '新增完成!'))
          .catch(rej => sendTextMessage(senderID, 'Sorry，新增失敗'))
      }
    }
  } else if (message.text.indexOf('刪除') === 0) {
    const element = message.text.split('新增')[1]
      if (element.length !== 0) {
        db.insertDataElements(senderID, element)
          .then(res => sendTextMessage(senderID, '成功刪除!'))
          .catch(rej => sendTextMessage(senderID, 'Sorry，刪除失敗'))
      }
  } else {
    sendTextMessage(senderID, '請善用按鈕哦～')
  }
  console.log(`From ${senderID}: ${message.text}`)
}

function receivedSticker(event) {
  sendTextMessage(event.sender.id, '貼圖不能吃啦')
}

function receivedPostback(event) {
  console.log('receive postback event:')
  console.log(JSON.stringify(event))
  const senderID = event.sender.id
  const payload = event.postback.payload
  if (payload === "GEN_FUNCTION_LIST"){
    sendFunctionList(senderID)
  } else if (payload === 'GET_STARTED'){
    db.insertData(senderID)
      .then(r => sendTextMessage(senderID, 'Hi，可以試試打開輸入欄旁的目錄哦~'))
      .catch(r => console.log(r))
  } else if (payload === 'GEN_CUSTOMIZED_LIST') {
    postbackHandler(senderID)
      .then(res => sendTextMessage(senderID, res))
      .catch(console.log)
  } else if (payload === 'SHOW_CUSTOMIZED_LIST') {
    db.getData(senderID)
      .then(res => sendTextMessage(senderID, res.toString()))
      .catch(rej => sendTextMessage(senderID, '無法取得QQ'))
  } else {
    // Get data from general lists
    postbackHandler(payload)
      .then(res => sendTextMessage(senderID, res))
      .catch(console.log)
  }
}

function messageDelivered(event) {
  console.log('message sent:', event.delivery.mids.toString(), event.delivery.watermark )
}

function messageRead(event) {
  console.log('message read:', event.read.watermark)
}

function sendme(req, res) {
  sendTextMessage(process.env.MY_PSID, req.body.text)
  return res.sendStatus(200)
}

module.exports = {
  webhook,
  verifyWebhook,
  sendme
}
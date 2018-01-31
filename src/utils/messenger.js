const request = require("request");

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token: process.env.FB_PAGE_ACCESS_TOKEN},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendSetup(setup) {
	request({
    url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
    qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: setup
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

function setupGetStart() {
  let obj = { 
    "get_started":{
      "payload":"bla"
    }
  }
  sendSetup(obj)
}

module.exports = {
  sendSetup,
  sendTextMessage,
  setupGetStart
}
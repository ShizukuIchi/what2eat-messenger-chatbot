const request = require("request");
const db = require("../utils/db.js");

function sendTextMessage(sender, text) {
  let messageData = { text: text };
  request(
    {
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
      method: "POST",
      json: {
        recipient: { id: sender },
        message: messageData
      }
    },
    function(error, response, body) {
      if (error) {
        console.log("Error sending messages: ", error);
      } else if (response.body.error) {
        console.log("Error: ", response.body.error);
      }
    }
  );
}
function sendAttachmentMessage(sender, data) {
  let messageData = { attachment: data };
  request(
    {
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
      method: "POST",
      json: {
        recipient: { id: sender },
        message: messageData
      }
    },
    function(error, response, body) {
      if (error) {
        console.log("Error sending messages: ", error);
      } else if (response.body.error) {
        console.log("Error: ", response.body.error);
      }
    }
  );
}

function sendSetup(setup) {
  request(
    {
      url: "https://graph.facebook.com/v2.6/me/messenger_profile",
      qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
      method: "POST",
      json: setup
    },
    function(error, response, body) {
      if (error) {
        console.log("Error sending messages: ", error);
      } else if (response.body.error) {
        console.log("Error: ", response.body.error);
      }
    }
  );
}

function genDefaultMenu() {
  return {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "web_url",
            title: "使用手冊",
            url: "http://sh1zuku.csie.io",
            webview_height_ratio: "full"
          },
          {
            type: "web_url",
            title: "關於我",
            url: "http://sh1zuku.csie.io",
            webview_height_ratio: "full"
          }
        ]
      }
    ]
  };
}
function setupGetStart() {
  sendSetup(genDefaultMenu());
}

function getIdFromToken(token) {
  return new Promise((res, rej) => {
    request(
      {
        url: "https://graph.facebook.com/v2.6/me",
        method: "GET",
        qs: {
          access_token: process.env.FB_PAGE_ACCESS_TOKEN,
          fields: "recipient",
          account_linking_token: token
        }
      },
      function(error, response, body) {
        if (error) {
          rej(error);
        } else if (response.body.error) {
          rej(response.body.error);
        } else {
          res(response);
        }
      }
    );
  });
}

function sendFunctionList(psid) {
  const data = {
    type: "template",
    payload: {
      template_type: "generic",
      elements: [
        {
          title: "骰子拉",
          subtitle: "產生1~6隨機數字",
          buttons: [
            {
              title: "GO!!!!",
              type: "postback",
              payload: "GEN_DICE_NUMBER"
            }
          ]
        },
        {
          title: "ㄘㄘ什麼?",
          subtitle: "不再煩惱，立刻產生食物！",
          buttons: [
            {
              title: "早餐",
              type: "postback",
              payload: "GEN_BREAKFAST"
            },
            {
              title: "午餐",
              type: "postback",
              payload: "GEN_LUNCH"
            },
            {
              title: "晚餐",
              type: "postback",
              payload: "GEN_DINNER"
            }
          ]
        }
      ]
    }
	};
	sendAttachmentMessage(psid, data)
}

module.exports = {
  sendSetup,
  sendTextMessage,
  setupGetStart,
  getIdFromToken,
  sendFunctionList
};

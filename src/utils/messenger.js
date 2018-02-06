const request = require("request");
const db = require("../utils/db.js");

function sendTextMessage(sender, text) {
  if(!text.length){
    throw new Error('None or empty string text provided.')
    return 
  } 
  if(sender === process.env.APP_PSID) {
    console.log(`${text} to myself.`)
    return
  }
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
  if(sender === process.env.APP_PSID) {
    console.log(`${data} to myself.`)
    return
  }
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
          title: "等等吃什麼？",
          subtitle: `
            餐點產生器！
            增加餐點請聯絡作者XD`,
          buttons: [
            {
              title: "食物",
              type: "postback",
              payload: "GEN_MEAL"
            },
            {
              title: "飲料",
              type: "postback",
              payload: "GEN_DRINK"
            },
            {
              title: "店家",
              type: "postback",
              payload: "GEN_SHOP"
            }
          ]
        },
        {
          title: "專屬清單",
          subtitle:
            `
            只屬於你/妳的菜單，
            輸入如 新增鐵板燒
            即可客製專屬清單！
            ※ 可輸入 刪除XXX`,
          buttons: [
            {
              title: "我想要吃...",
              type: "postback",
              payload: "GEN_CUSTOMIZED_LIST"
            },
            {
              title: "查看清單內容",
              type: "postback",
              payload: "SHOW_CUSTOMIZED_LIST"
            }
          ]
        },
        {
          title: "公共清單",
          subtitle: `
            以 '新增大家的XXX' 擴充清單，
            裡面可能有怪怪的東西XD
            `,
          buttons: [
            {
              title: "大家都想吃什麼？",
              type: "postback",
              payload: "GEN_PUBLIC_LIST"
            }
          ]
        },
        {
          title: "骰子",
          subtitle: `
            按太多下結果不知道要吃什麼了嗎？
            骰子為您準備好了！
          `,
          buttons: [
            {
              title: "就決定是你了！",
              type: "postback",
              payload: "GEN_DICE_NUMBER"
            }
          ]
        }
      ]
    }
  };
  sendAttachmentMessage(psid, data);
}

module.exports = {
  sendSetup,
  sendTextMessage,
  setupGetStart,
  getIdFromToken,
  sendFunctionList
};

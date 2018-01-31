const { sendSetup, sendTextMessage } = require("./messenger.js");
const db = require("./db.js")

const randomEat = {
  "title": "ㄘㄘ",
  "type": "nested",
  "call_to_actions": [
    {
      "title": "早餐",
      "type": "postback",
      "payload": "GEN_BREAKFAST"
    },
    {
      "title": "午餐",
      "type": "postback",
      "payload": "GEN_LUNCH"
    },
    {
      "title": "晚餐",
      "type": "postback",
      "payload": "GEN_DINNER"
    }
  ]
};

const dice = {
  "title": "Dice",
  "type": "postback",
  "payload": "GEN_DICE_NUMBER"
};

const defaultMenu = {
  "persistent_menu": [
    {
      "locale": "default",
      "composer_input_disabled": false,
      "call_to_actions": [
        {
          "type": "web_url",
          "title": "web view",
          "url": process.env.APP_DOMAIN,
          "webview_height_ratio": "full"
        }
      ]
    }
  ]
};

class Menu {
  constructor(psid) {
    this.psid = psid;
    this.menu = defaultMenu;
    // this.setup()
  }
  loadMenu(psid) {
    this.menu = defaultMenu;
  }
  addSubMenu(name, position = 0) {
    const newMenu = { ...this.menu };
    switch (name) {
      case "random-eat":
        newMenu.persistent_menu[0].call_to_actions.splice(index, 0, randomEat);
        break;
      case "dice":
        newMenu.persistent_menu[0].call_to_actions.splice(index, 0, dice);
        break;
    }
    this.menu = newMenu;
    this.setup();
  }
  deleteSubMenu(index) {
    const newMenu = { ...this.menu };
    const subMenus = [...newMenu.persistent_menu[0].call_to_actions];
    subMenus = [...subMenus.slice(0, index), ...subMenus.slice(index + 1)];
    newMenu.persistent_menu[0].call_to_actions = subMenus;
    this.menu = newMenu;
    this.setup();
  }
  setup() {
    console.log("send menu:", this.menu, this.psid);
    sendSetup(this.menu);
  }
  updateDB() {
    db.updateUser(this.psid, this.menu)
  }
}

module.exports = {
  Menu,
  defaultMenuObject: defaultMenu,
};

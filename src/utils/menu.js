const { sendSetup, sendTextMessage } = require("./messenger.js");
const db = require("./db.js")



class Menu {
  constructor(psid) {
    this.psid = psid;
    this.menu = {};
  }
  addSubMenu(name, position = 0) {
    const newMenu = { ...this.menu };
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
};

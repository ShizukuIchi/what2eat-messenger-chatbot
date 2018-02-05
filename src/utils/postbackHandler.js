const datas = require('./datas');
const db = require("../utils/db.js")

function postbackHandler(name) {
  switch(name) {
    case 'GET_STARTED':
    return '在輸入框旁找到目錄，試試按下功能清單吧！'
    case 'GEN_DICE_NUMBER':
    return Promise.resolve(random(1,6)) 
    case 'GEN_LUNCH':
    return genRandomElementFrom('lunch')
    case "GEN_BREAKFAST":
    return genRandomElementFrom('breakfast')
    case "GEN_DINNER":
    return genRandomElementFrom('dinner')
    case "GEN_MEAL":
    return genRandomElementFrom('meal')
    case "GEN_DRINK":
    return genRandomElementFrom('drink')
    case "GEN_SHOP":
    return genRandomElementFrom('shop')
    default:
    return null
  }
}

function random(from, to) {
  return Math.floor((Math.random()*(to-from+1))+from)
}

async function genRandomElementFrom(name) {
  return new Promise((res, rej) => {
    db.getData(name)
      .then(data => res(data[random(0, data.length-1)]))
      .catch(e => rej(e))
  })
}



module.exports = postbackHandler

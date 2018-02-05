const datas = require('./datas');
const db = require("../utils/db.js")

function postbackHandler(name) {
  switch(name) {
    case 'GEN_DICE_NUMBER':
    return Promise.resolve(random(1,6)) 
    case 'GEN_PUBLIC_LIST':
    return genRandomElementFrom('public')
    case "GEN_MEAL":
    return genRandomElementFrom('meal')
    case "GEN_DRINK":
    return genRandomElementFrom('drink')
    case "GEN_SHOP":
    return genRandomElementFrom('shop')
    default:
    return genRandomElementFrom(name)
  }
}

function random(from, to) {
  return Math.floor((Math.random()*(to-from+1))+from)
}

async function genRandomElementFrom(name) {
  return new Promise((res, rej) => {
    db.getData(name)
      .then(data => {
        if(data.length !== 0)
          res(data[random(0, data.length-1)])
        res("清單空空如也，趕快輸入'新增XXX'來製作你/妳的清單吧！")
      })
      .catch(e => rej(e))
  })
}



module.exports = postbackHandler

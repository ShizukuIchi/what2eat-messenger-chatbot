const datas = require('./datas');
const db = require("../utils/db.js")

function postbackHandler(name) {
  switch(name) {
    case 'GET_STARTED':
    return '在輸入框旁找到目錄，試試按下功能清單吧！'
    case 'GEN_DICE_NUMBER':
    return random(1,6) 
    case 'GEN_LUNCH':
    return genRandomElementFrom('lunch')
    case "GEN_BREAKFAST":
    return genRandomElementFrom('breakfast')
    case "GEN_DINNER":
    return genRandomElementFrom('dinner')
    default:
    return null
  }
}

function random(from, to) {
  return Math.floor((Math.random()*(to-from+1))+from)
}

function genRandomElementFrom(name) {
  // const data = datas[name].data
  // return data[random(0,data.length-1)]
  db.getData(name).then(result=>{
    console.log('-------------------------------')
    console.log(JSON.stringify(result))
  })
  return 'test'
}



module.exports = postbackHandler

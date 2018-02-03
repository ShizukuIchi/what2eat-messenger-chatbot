const { dinner, lunch, breakfast } = require('./datas');

function postbackHandler(name) {
  switch(name) {
    case 'GET_STARTED':
    return '在輸入框旁找到目錄，試試按下功能清單吧！'
    case 'GEN_DICE_NUMBER':
    return random(1,6) 
    case 'GEN_LUNCH':
    return genLunch()
    case "GEN_BREAKFAST":
    return genBreakfast()
    case "GEN_DINNER":
    return genDinner()
    default:
    return null
  }
}

function random(from, to) {
  return Math.floor((Math.random()*(to-from+1))+from)
}

function genLunch() {
  const randomIndex = random(0, lunch.length-1)
  return lunch[randomIndex]
}

function genBreakfast() {
  const randomIndex = random(0, breakfast.length-1)
  return breakfast[randomIndex]
}

function genDinner() {
  const randomIndex = random(0, dinner.length-1)
  return dinner[randomIndex]
}

module.exports = postbackHandler

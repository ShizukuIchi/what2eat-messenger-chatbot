const lunchList = [
  '豚骨拉麵',
  '義大利麵',
  '鍋燒意麵'
]
const breakfastList = [
  '漢堡',
  '吐司',
  '三文治'
]
const dinnerList = [
  '夏慕尼',
  '陶板屋',
  '石二鍋'
]

function postbackHandler(name) {
  switch(name) {
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
  const randomIndex = random(0, lunchList.length-1)
  return lunchList[randomIndex]
}

function genBreakfast() {
  const randomIndex = random(0, breakfastList.length-1)
  return breakfastList[randomIndex]
}

function genDinner() {
  const randomIndex = random(0, dinnerList.length-1)
  return dinnerList[randomIndex]
}

module.exports = postbackHandler

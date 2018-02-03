const fs = require('fs')

const { insert, remove, getData } = require('./dataHandler.js')
const data = require('./datas')


console.log(getData())
// insert('lunch', 'a').then(()=>{
//   let raw = fs.readFileSync('./datas/lunch.json')
//   console.log(JSON.parse(raw))
// })
// remove('lunch', 'a')
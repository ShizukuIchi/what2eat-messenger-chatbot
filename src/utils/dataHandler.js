const fs = require('fs');

const datas = require('./datas')

function insert(name, element) {
  if (Object.keys(datas).indexOf(name) === -1) {
    throw new Error('no '+name)
  }
  const newData = [...datas[name].data]
  const index = newData.indexOf(element)
  if (index === -1) {
    newData.push(element)
    return new Promise((res, rej) => {
      fs.writeFile(`./datas/${name}.json`, JSON.stringify({data:newData}), (e) => {
        if (e){
          throw e;
          rej(e)
        } else {
          console.log(`${element} has been added to ${name}.`)
          res()
        }
      })
    })
  } else {
    console.log(`${element} exists in ${name}`)
    return Promise.resolve()
  }
}

function remove(name, element) {
  if (Object.keys(datas).indexOf(name) === -1) {
    throw new Error('no '+name)
  }
  const newData = [...datas[name].data]
  const index = newData.indexOf(element)
  if (index !== -1){
    return new Promise((res, rej) => {
      newData.splice(index, 1)
      fs.writeFile(`./datas/${name}.json`, JSON.stringify({data:newData}), (e) => {
        if (e) {
          throw e;
          rej(e)
        } else {
          console.log(`${element} has been deleted from ${name}.`)
          res()
        }
      })
    })
  } else {
    console.log(`${element} doesn't exist in ${name}.`)
    return Promise.resolve()
  }
}

function getData(name = '*') {
  return name === '*' ? Object.keys(datas).map(key=>datas[key].data) : datas[name].data;
}

module.exports = {
  insert,
  remove,
  getData
}

const { Client } = require('pg');

class DB {
  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });
    this.client.connect();
  }
  getDatasTable() {
    return new Promise((res) => {
      this.client.query('SELECT * FROM datas')
        .then(result => res(result.rows))
        .catch(e => {throw e})
    })
  }
  getData(name) {
    return new Promise((res) => {
      this.client.query(`SELECT data->'elements' FROM datas WHERE data->'name' = '"${name}"'`)
        .then(result => res(result.rows[0]['?column?']))
        .catch(e => {throw e})
    })
  }
  isDataExist(name) {
    return new Promise(res => {
      this.client.query(`SELECT EXISTS(SELECT 1 FROM datas WHERE data->'name' = '"${name}"' )`)
        .then(result => {console.log(result);res(result.rows[0].exist)})
        .catch(e => {throw e;})
    }) 
  }
  async insertData(name, elements = []) {
    const exist = await this.isDataExist(name)
    if(!exist){
      console.log(`no ${name}.`)
      return
    }
    const query = {
      text: 'INSERT INTO datas(data) VALUES($1);',
      values: [`{"name":"${name}","elements":${JSON.stringify(data)}}`]
    }
    return new Promise(res => {
      this.client.query(query)
        .then(result => res(result.rows))
        .catch(e => {throw e})
    })
  }
  async insertDataElements(name, elements) {
    const exist = await this.isDataExist(name)
    if(!exist) {
      console.log(`no ${name}.`)
      return
    }
    const query = {
      text: `UPDATE datas
        SET data = jsonb_set(
          data::jsonb,
          '{elements}',
          (data->'elements')::jsonb || '$1'::jsonb) 
        WHERE data->'name' = '$2';`,
      values: [JSON.stringify(elements), name]
    }
    return new Promise(res => {
      this.client.query(query)
        .then(result => res(result))
        .catch(e => {throw e})
    })
  }
  async deleteDataElement(name, element) {
    const exist = await this.isDataExist(name)
    if(!exist) {
      console.log(`no ${name}.`)
      return
    }
    const query = {
      text: `UPDATE datas
        SET data = jsonb_set(
          data::jsonb,
          '{elements}',
          (data->'elements')::jsonb - '$1'::jsonb) 
        WHERE data->'name' = '$2';`,
      values: [element, name]
    }
    return new Promise(res => {
      this.client.query(query)
        .then(result => res(result))
        .catch(e => {throw e})
    })
  }

  kill() {
    this.client.end();
  }
}

module.exports = new DB();
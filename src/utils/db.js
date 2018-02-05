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
    return new Promise((res, rej) => {
      this.client.query('SELECT * FROM datas')
        .then(result => res(result.rows))
        .catch(e => {
          rej(e);
          throw e
        })
    })
  }
  getData(name) {
    return new Promise((res, rej) => {
      this.client.query(`SELECT data->'elements' FROM datas WHERE data->'name' = '"${name}"'`)
        .then(result => res(result.rows[0]['?column?']))
        .catch(e => {
          rej(e)
          throw e
        })
    })
  }
  isDataExist(name) {
    return new Promise((res, rej) => {
      this.client.query(`SELECT EXISTS(SELECT 1 FROM datas WHERE data->'name' = '"${name}"' )`)
        .then(result => {
          if(result.rows[0].exists)
            console.log(`${name} exists.`)
          else 
            console.log(`${name} doesn't exists`)
          res(result.rows[0].exists)
        })
        .catch(e => {
          rej(e)
          throw e;
        })
    }) 
  }
  async insertData(name, elements = []) {
    const exist = await this.isDataExist(name)
    return new Promise((res, rej) => {
      if (exist) {
        console.log(`${name} already exists.`)
        rej(`${name} already exists.`)
      }
      const query = `INSERT INTO datas(data) VALUES('{"name":"${name}", "elements":${JSON.stringify(elements)}}')`
      this.client.query(query)
        .then(result => res(result.rows))
        .catch(e => {
          rej(e)
          throw e
        })
    })
  }
  async insertDataElements(name, elements) {
    const exist = await this.isDataExist(name)
    return new Promise((res, rej) => {
      if(!exist) {
        console.log(`no ${name}.`)
        rej(`no ${name}`)
      }
      const query = `
        UPDATE datas
        SET data = jsonb_set(
          data::jsonb,
          '{elements}',
          (data->'elements')::jsonb || '${JSON.stringify(elements)}'::jsonb) 
        WHERE data->'name' = '"${name}"'`
      this.client.query(query)
        .then(result => res(result))
        .catch(e => {
          rej(e);
          throw e;
        })
    })
  }
  async deleteDataElement(name, element) {
    const exist = await this.isDataExist(name)
    return new Promise((res, rej) => {
      if(!exist) {
        console.log(`no ${name}.`)
        rej(`no ${name}`)
      }
      const query = `
        UPDATE datas
        SET data = jsonb_set(
          data::jsonb,
          '{elements}',
          (data->'elements')::jsonb - '${element}') 
        WHERE data->'name' = '"${name}"';`
    
      this.client.query(query)
        .then(result => res(result))
        .catch(e => {
          rej(e)
          throw e
        })
    })
  }

  kill() {
    this.client.end();
  }
}

module.exports = new DB();
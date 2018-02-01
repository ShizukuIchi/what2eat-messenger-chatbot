const { Client } = require('pg');

class DB {
  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });
    this.client.connect();
  }
  async getTable() {
    let result = null
    try {
      result = await this.client.query('SELECT * FROM users;')
        .then(result => result.rows)
    } catch(e) {
      throw e
    }
  }
  async genError() {
    let result = null
    try {
      result = await this.client.query('SELECT * FROM user;')
        .then(result => result.rows)
    } catch(e) {
      throw e
    }
  }
  async getUsers() {
    let result = null
    try {
      result = await this.client.query('SELECT * FROM users;')
        .then(result => result.rows)
    } catch(e) {
      throw e
    }
    return result
  }

  async getUserInfo(uid) {
    let result = null
    const query = {
      text: "SELECT * FROM users WHERE uid = $1;",
      values: [uid]
    }
    try {
      result = await this.client.query(query)
        .then(result => result.rows)
    } catch(e) {
      throw(e)
    }
    return result
  }

  async insertUser(uid) {
    let result = null
    result = await this.getUserInfo(uid)

    if(result.length >= 1){
      console.log('existed')
      return result
    }
    const query = {
      text: 'INSERT INTO users(uid,menu) values($1, $2)',
      values: [uid, '{"status":"new"}']
    }
    try {
      result = await this.client.query(query)
        .then(result => result.rows)
    } catch(e) {
      throw e
    }
    return result
  }

  async updateUser(uid, menu) {
    let result = null
    const user = await this.getUserInfo(uid)
    if(user.length === 0){
      console.log('no user')
      return
    }
    const query = {
      text: `UPDATE users SET menu = $1 WHERE id = $2;`,
      values: ['{"status":"updated"}', user[0].id]
    }
    try {
      result = await this.client.query(query)
        .then(result => result.rows)
    } catch(e) {
      throw e
    }
    return result
  }

  async deleteUser(uid) {
    let result = null
    const user = await this.getUserInfo(uid)
    if (user.length === 0) {
      console.log('no user')
      return result
    }
    let query = {
      text: 'DELETE FROM users WHERE id = $1;',
      values: [user[0].id]
    }
    try {
      result = await this.client.query(query)
        .then(result => result.rows)
    } catch(e) {
      console.log(e)
    }
    return result
  }

  kill() {
    this.client.end();
  }
}

module.exports = new DB();
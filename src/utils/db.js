const { Client } = require('pg');

class DB {
  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });
    this.client.connect();
  }

  async getUsers() {
    let result = null
    try {
      result = await this.client.query('SELECT id, uid FROM users;')
        .then(result => result.rows)
    } catch(e) {
      console.log(e)
    }
    return result
  }

  async getUserInfo(uid) {
    let result = null
    const query = {
      text: "SELECT id,uid,todos FROM users WHERE uid = $1;",
      values: [uid]
    }
    try {
      result = await this.client.query(query)
        .then(result => result.rows)
    } catch(e) {
      console.log(e)
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
      text: 'INSERT INTO users(uid, todos) values($1, $2)',
      values: [uid, `[{"name":"測試","deadline":"${new Date().getTime()}"}]`]
    }
    try {
      result = await this.client.query(query)
        .then(result => result.rows)
    } catch(e) {
      console.log(e)
    }
    return result
  }

  async insertUserReminder(uid, name, deadline) {
    let result = null
    result = await this.getUserInfo(uid)
    if(result.length === 0){
      console.log('no user')
      return result
    }
    const newJson = [...result[0].todos,{name,deadline:deadline.getTime()}]
    const query = {
      text: `UPDATE users SET todos = $1 WHERE id = $2;`,
      values: [JSON.stringify(newJson), result[0].id]
    }
    try {
      result = await this.client.query(query)
        .then(result => result.rows)
    } catch(e) {
      console.log(e)
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
    const { id } = user[0]
    let query = {
      text: 'DELETE FROM users WHERE id = $1;',
      values: [id]
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
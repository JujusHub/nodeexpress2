const bcrypt = require('bcrypt');
const db = require('../db');
const ExpressError = require('../helpers/expressError');
const sqlForPartialUpdate = require('../helpers/partialUpdate');
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  static async register({ username, password, first_name, last_name, email, phone }) {
    const duplicateCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(`There already exists a user with username '${username}'`, 400);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, phone) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING username, password, first_name, last_name, email, phone`,
      [username, hashedPassword, first_name, last_name, email, phone]
    );

    return result.rows[0];
  }

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username, password, first_name, last_name, email, phone, admin 
       FROM users WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      throw new ExpressError('Cannot authenticate', 401);
    }
  }

  static async getAll() {
    const result = await db.query(
      `SELECT username, first_name, last_name, email, phone FROM users ORDER BY username`
    );
    return result.rows;
  }

  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, email, phone 
       FROM users WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      throw new ExpressError('No such user', 404);
    }

    return user;
  }

  static async update(username, data) {
    let { query, values } = sqlForPartialUpdate('users', data, 'username', username);

    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw new ExpressError('No such user', 404);
    }

    return user;
  }

  static async delete(username) {
    const result = await db.query(
      'DELETE FROM users WHERE username = $1 RETURNING username',
      [username]
    );
    const user = result.rows[0];

    if (!user) {
      throw new ExpressError('No such user', 404);
    }

    return true;
  }
}

module.exports = User;

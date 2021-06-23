import {User} from '../../models/User';
import sqlite3 from 'sqlite3';

const DBSOURCE = "./src/services/sqlite/database.db" ;
let db = new (sqlite3.verbose().Database)(DBSOURCE);

db.run(`CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name text,
  email text
)`);

// Run comment below to insert data
// db.run(`INSERT INTO users (name, email) VALUES ('tester', 'tester@gmail.com');`)
// db.run(`INSERT INTO users (name, email) VALUES ('tester2', 'tester@gmail.com');`)
// db.run(`INSERT INTO users (name, email) VALUES ('tester3', 'tester@gmail.com');`)

export class SqlUserService {
  constructor() {
  }
  all(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      db.all('SELECT * FROM users', (err: any, results: any) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        else{
          return resolve(results);
        }
      })
    });
  }
  load(id: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = $1', 
      [id],  (err: any, results: any) => {
        if (err) {
          return reject(err);
        }
        else{
          return resolve(results);
        }
      })
    });
  }
  insert(user: User): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      db.run('INSERT INTO users (name, email) VALUES ($1, $2)', 
      [user.name, user.email],  (err: any, results: any) => {
        if (err) {
          return reject(err);
        }
        else{
          return resolve(results);
        }
      })
    });
  }
  update(user: User): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      db.run('UPDATE users SET name=$1, email=$2 WHERE id = $3', 
      [user.name, user.email, user.id],  (err: any, results: any) => {
        if (err) {
          return reject(err);
        }
        else{
          return resolve(results);
        }
      })
    });
  }
  delete(id: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = $1', 
      [id],  (err: any, results: any) => {
        if (err) {
          return reject(err);
        }
        else{
          return resolve(results);
        }
      })
    });
  }
}

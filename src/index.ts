import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { json } from 'body-parser';
import { createContext } from './init';
import { route } from './route';
import sqlite3, { Database } from 'sqlite3';
dotenv.config();

const app = express();

const port = process.env.PORT;

const DBSOURCE = './src/services/sqlite/database.db';
let db = new (sqlite3.verbose().Database)(DBSOURCE);
db.run(`CREATE TABLE IF NOT EXISTS users(
  userId INTEGER PRIMARY KEY,
  name text,
  email text
)`);
app.use(json());
http.createServer(app).listen(port, () => {
  console.log('Start server at port ' + port);
});
const ctx = createContext(db);
route(app, ctx);

import { json } from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import sqlite3 from 'sqlite3';
import { createContext } from './init';
import { route } from './route';
dotenv.config();

const app = express();

const port = process.env.PORT;

const DBSOURCE = './src/services/sqlite/database.db';
const db = new (sqlite3.verbose().Database)(DBSOURCE);
db.run(`create table if not exists users(
  userId integer primary key,
  name text,
  email text
)`);
app.use(json());
http.createServer(app).listen(port, () => {
  console.log('Start server at port ' + port);
});
const ctx = createContext(db);
route(app, ctx);

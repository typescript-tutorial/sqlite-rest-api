import { Database } from 'sqlite3';
import { User } from '../../models/User';
import { Model, Statement } from './metadata';
import { exec, execBatch, query, queryOne, saveBatch } from './sqlite';

export const userModel: Model = {
  name: 'user',
  attributes: {
    userId: {
      key: true,
      type: 'integer',
      match: 'equal'
    },
    name: {
      match: 'contain'
    },
    email: {
    }
  }
};

export class SqlUserService {
  constructor(private db: Database) {}
  all(): Promise<User[]> {
    return query<User>(this.db, 'select * from users');
  }
  load(id: string): Promise<User> {
    return queryOne(this.db, 'select * from users where userId = $1', [id]);
  }
  insert(user: User): Promise<number> {
    return exec(this.db, `insert into users (userId, name, email) values ($1, $2, $3)`, [user.userId, user.name, user.email]);
  }
  insertMany(users: User[]): Promise<number> {
    
  const statements = users.map(stmt => {
    return { query: `insert into users (userId, name, email) values ($1, $2, $3)`, params: [stmt.userId, stmt.name, stmt.email] };
  });
    
  // const s = `insert into users (userId, name, email) values (8, 'user8', 'user8@gmail.com');insert into users (userId, name, email) values (6, 'user8', 'user8@gmail.com');
  // insert into users (userId, name, email) values (9, 'user9', 'user9@gmail.com');`;
  // const st: Statement = {query: s};
  // const statements = [st];
  // return saveBatch(this.db, users, 'users', userModel.attributes);
  return execBatch(this.db, statements, true);
  }
  update(user: User): Promise<number> {
    return exec(this.db, `update users set name=$1, email=$2 where userId = $3`, [user.name, user.email, user.userId]);
  }
  delete(id: string): Promise<number> {
    return exec(this.db, `delete from users where userId = $1`, [id]);
  }
}

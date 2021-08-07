import { Database } from 'sqlite3';
import { User } from '../../models/User';
import { exec, execBatch, query, queryOne } from './sqlite';

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
      return { query: `insert into users (userId, name, email) values ($1, $2, $3)`, args: [stmt.userId, stmt.name, stmt.email] };
    });
    return execBatch(this.db, statements);
  }
  update(user: User): Promise<number> {
    return exec(this.db, `update users set name=$1, email=$2 where userId = $3`, [user.name, user.email, user.userId]);
  }
  delete(id: string): Promise<number> {
    return exec(this.db, `delete from users where userId = $1`, [id]);
  }
}

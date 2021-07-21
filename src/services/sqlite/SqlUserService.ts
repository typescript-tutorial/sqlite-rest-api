import { User } from '../../models/User';
import { Database, Statement } from 'sqlite3';
import { query, queryOne, exec, execute } from './sqlite';
export class SqlUserService {
  constructor(private db: Database) {}
  all(): Promise<User[]> {
    return query<User>(this.db, 'SELECT * FROM users');
  }
  load(id: string): Promise<User> {
    return queryOne(this.db, 'SELECT * FROM users WHERE userId = $1', [id]);
  }
  insert(user: User): Promise<number> {
    return exec(this.db, `INSERT INTO users (userId, name, email) VALUES ($1, $2, $3)`, [user.userId, user.name, user.email]);
  }
  insertMany(users: User[]): Promise<number> {
    const statements = users.map((item) => {
      return { query: `INSERT INTO users (userId, name, email) VALUES ($1, $2, $3)`, args: [item.userId, item.name, item.email] };
    });
    return execute(this.db, statements);
  }
  update(user: User): Promise<number> {
    return exec(this.db, `UPDATE users SET name=$1, email=$2 WHERE userId = $3`, [user.name, user.email, user.userId]);
  }
  delete(id: string): Promise<number> {
    return exec(this.db, `DELETE FROM users WHERE userId = $1`, [id]);
  }
}

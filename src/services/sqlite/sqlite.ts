import { Database } from 'sqlite3';

export interface StringMap {
  [key: string]: string;
}
export interface Statement {
  query: string;
  args?: any[];
}

export interface Manager {
  exec(sql: string, args?: any[]): Promise<number>;
  execute(statements: Statement[]): Promise<number>;
  query<T>(sql: string, args?: any[], m?: StringMap, fields?: string): Promise<T[]>;
  queryOne<T>(sql: string, args?: any[], m?: StringMap, fields?: string): Promise<T>;
}
export class PoolManager implements Manager {
  constructor(public db: Database) {
    this.exec = this.exec.bind(this);
    this.execute = this.execute.bind(this);
    this.query = this.query.bind(this);
    this.queryOne = this.queryOne.bind(this);
  }
  exec(sql: string, args?: any[]): Promise<number> {
    return exec(this.db, sql, args);
  }
  execute(statements: Statement[]): Promise<number> {
    return execute(this.db, statements);
  }
  query<T>(sql: string, args?: any[], m?: StringMap, fields?: string): Promise<T[]> {
    return query(this.db, sql, args, m, fields);
  }
  queryOne<T>(sql: string, args?: any[], m?: StringMap, fields?: string): Promise<T> {
    return queryOne(this.db, sql, args, m, fields);
  }
}
export function execute(db: Database, statements: Statement[]): Promise<number> {
  db.exec('begin transaction', (err: any) => {
    console.log('begin');
  });
  return new Promise<number>((resolve, reject) => {
    let count = 0;
    statements.forEach((item, index) => {
      db.run(item.query, item.args ? item.args : [], (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          count = count + 1;
          if(count === statements.length) {
            resolve(count);
          }
        }
      });
    });
  })
    .then((result) => {
      return new Promise<number>((resolve, reject) => {
        db.exec('commit', (err: any) => {
          console.log('commit');
          if(err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }).then(() => result).catch(() => 0);
    })
    .catch((e) => {
      return new Promise<number>((resolve, reject) => {
        db.exec('rollback', (err: any) => {
          console.log('rollback');
          if (err) {
            reject(err);
          }
          resolve(0);
        });
      }).then(() => 0).catch(e => e);
    });
}
export function exec(db: Database, sql: string, args?: any[]): Promise<number> {
  const p = args ? args : [];
  return new Promise<number>((resolve, reject) => {
    return db.run(sql, p, (err: any, results: any) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        return resolve(results);
      }
    });
  });
}
export function query<T>(db: Database, sql: string, args?: any[], m?: StringMap, fields?: string): Promise<T[]> {
  const p = args ? args : [];
  return new Promise<T[]>((resolve, reject) => {
    return db.all(sql, p, (err: any, results: T[]) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(handleResults<T>(results, m));
      }
    });
  });
}
export function queryOne<T>(db: Database, sql: string, args?: any[], m?: StringMap, fields?: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    return db.get(sql, args, m, fields, (err: any, results: any) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(results);
      }
    });
  });
}

export function handleResults<T>(r: T[], m?: StringMap, fields?: string) {
  if (m) {
    const res = mapArray(r, m);
    return res;
  }
  return r;
}
export function mapArray<T>(results: T[], m?: StringMap): T[] {
  if (!m) {
    return results;
  }
  const mkeys = Object.keys(m);
  if (mkeys.length === 0) {
    return results;
  }
  const objs = [];
  const length = results.length;
  for (let i = 0; i < length; i++) {
    const obj = results[i];
    const obj2: any = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      let k0 = m[key];
      if (!k0) {
        k0 = key;
      }
      obj2[k0] = (obj as any)[key];
    }
    objs.push(obj2);
  }
  return objs;
}

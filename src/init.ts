import { Database } from 'sqlite3';
import { ApplicationContext } from './context';
import { UserController } from './controllers/UserController';
import { SqlUserService } from './services/SqlUserService';

export function createContext(db: Database): ApplicationContext {
  const userService = new SqlUserService(db);
  const userController = new UserController(userService);
  const ctx: ApplicationContext = { userController };
  return ctx;
}

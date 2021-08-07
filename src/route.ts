import { Application } from 'express';
import { ApplicationContext } from './context';

export function route(app: Application, ctx: ApplicationContext): void {
  const user = ctx.userController;
  app.get('/users', user.all);
  app.get('/users/:id', user.load);
  app.post('/user', user.insert);
  app.post('/users', user.insertMany);
  app.put('/users/:id', user.update);
  app.delete('/users/:id', user.delete);
}

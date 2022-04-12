import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as http from 'http';
import { Schema, model, connect } from 'mongoose';
dotenv.config();
connect(String(process.env.DB_URL));
class App {
  public app: express.Application;
  public httpServer: http.Server;
  public port: number;

  constructor() {
    dotenv.config();
    this.app = express();
    this.port = Number(process.env.PORT);
    this.httpServer = http.createServer(this.app);

    this.initializeControllers();

    // this.app.use(
    //   process.env.APPLICATION_ROOT + '/api-docs',
    //   swaggerUi.serve,
    //   swaggerUi.setup(openapiSpecification)
    // )
  }

  private initializeControllers(): void {}

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;

interface IUser {
  dimou: String;
}

// 2. Create a Schema corresponding to the document interface.

const app = new App();
const userSchema = new Schema<IUser>({
  dimou: { type: String, required: true },
});

// 3. Create a Model.
const User = model<IUser>('User', userSchema);
app.app.get('/', (req: Request, res: Response) => {
  User.find({}, (err, users) => {
    console.log(users);
    return res.send(`Hello World!${users}`);
  });
});
app.listen();
dotenv.config();

import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import {User} from "./db/models/User";
import {initModels} from "./db/models/init-models";
import {sequelize} from "./db/sequelize";
import * as expressWinston from 'express-winston';
import * as winston from 'winston';
import cors from "cors";
import {CommonRoutesConfig} from "./common/common.routes.config";
import { UserRoutes } from "./routes/user.routes.config";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const routes: Array<CommonRoutesConfig> = [];

app.use(express.json());
app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({all: true})
    )
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new UserRoutes(app));

const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
});

app.get('/create-user', async (req: Request, res: Response) => {
    const models = initModels(sequelize);

    models.User.create({
        email: "andrei_barosanu@hotmail.com",
        first_name: "Andrei",
        last_name: "Barosanu",
        password: "whatever",
        phone: "0721234321"
    }).then((result: User) => {
        res.send(result);
    })
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
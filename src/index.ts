import express, { Express } from "express";
import dotenv from "dotenv";
import * as expressWinston from "express-winston";
import * as winston from "winston";
import cors from "cors";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { UserRoutes } from "./routes/user.routes.config";
import { AuthRoutes } from "./routes/auth.routes.config";
import { PartnerRoutes } from "./routes/partner.routes.config";

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
    winston.format.colorize({ all: true })
  ),
};

app.use(expressWinston.logger(loggerOptions));

routes.push(new UserRoutes(app));
routes.push(new AuthRoutes(app));
routes.push(new PartnerRoutes(app));

const runningMessage = `Server running at http://localhost:${port}`;
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

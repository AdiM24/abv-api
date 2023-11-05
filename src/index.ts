import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UserRoutes } from './routes/user.routes.config';
import { AuthRoutes } from './routes/auth.routes.config';
import { PartnerRoutes } from './routes/partner.routes.config';
import { ProductRoutes } from './routes/product.routes.config';
import { InvoiceRoutes } from './routes/invoice.routes.config';
import { EmployeeRoutes } from './routes/employee.routes.config';
import { TimesheetRoutes } from './routes/timesheet.routes.config';
import { AutoFleetRoutes } from './routes/auto-fleet.routes.config';
import { RegisterRoutes } from './routes/register.routes.config';
import { ReceiptRoutes } from './routes/receipt.routes.config';
import { EmailRoutes } from './routes/email.routes.config';
import { OrderRoutes } from './routes/order.routes.config';
import morgan from 'morgan';
import { ImageRoutes } from './routes/image.routes.config';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const routes: Array<CommonRoutesConfig> = [];

app.use(express.json({ limit: '10MB' }));
app.use(morgan('dev'));
app.use(cors());

routes.push(new UserRoutes(app));
routes.push(new AuthRoutes(app));
routes.push(new PartnerRoutes(app));
routes.push(new ProductRoutes(app));
routes.push(new InvoiceRoutes(app));
routes.push(new EmployeeRoutes(app));
routes.push(new TimesheetRoutes(app));
routes.push(new AutoFleetRoutes(app));
routes.push(new RegisterRoutes(app));
routes.push(new ReceiptRoutes(app));
routes.push(new EmailRoutes(app));
routes.push(new OrderRoutes(app));
routes.push(new ImageRoutes(app));

const runningMessage = `Server running at http://172.17.0.1:${port}`;
app.get('/api/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage);
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

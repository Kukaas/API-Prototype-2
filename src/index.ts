import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';


import { userRouter } from './user/user.router';
import { productionRouter } from './production/production.router';
import { inventoryRouter } from './inventory/inventory.router';
import { finishedProductRouter } from './finishedproduct/finishedproduct.router';
import { orderRouter } from './order/order.router';

dotenv.config();

if(!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/production', productionRouter);
app.use('/api/finished-product', finishedProductRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/order', orderRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

export default app;
import * as dotenv from 'dotenv';
const cors = require('cors');
const express = require('express');


import { userRouter } from './user/user.router';
import { productionRouter } from './production/production.router';
import { inventoryRouter } from './inventory/inventory.router';
import { finishedProductRouter } from './finishedproduct/finishedproduct.router';
import { orderRouter } from './order/order.router';
import { salesReportRouter } from './salesreport/salesreport.router';
import { adminRouter } from './admin/admin.router';
import { orderItemsRouter } from './orderitems/orderitems.router';
import { rawMaterialsRouter } from './rawmaterials/rawmaterials.router';

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
app.use('/api/sales-report', salesReportRouter);
app.use('/api/admin', adminRouter);
app.use('/api/order-items', orderItemsRouter);
app.use('/api/raw-material-inventory', rawMaterialsRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

export default app;
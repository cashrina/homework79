import express from 'express';
import mysqlDb from './mysqlDb';
import categoriesRouter from './routers/categories';
import locationRouter from './routers/locations';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static('public'));
app.use('/categories', categoriesRouter);
app.use('/locations', locationRouter);

const run = async () => {
  await mysqlDb.init();

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });
};

run().catch(console.error);


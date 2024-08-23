import express from 'express';
import {Product, ProductMutation} from '../types';
import {imagesUpload} from '../multer';
import mysqlDb from '../mysqlDb';
import {ResultSetHeader} from 'mysql2';

const productsRouter = express.Router();

productsRouter.get('/', async (_req, res) => {
  const products = await mysqlDb.getConnection().query('SELECT * FROM products');
  return res.send(products);
});

productsRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send({ error: 'Invalid product ID!' });
  }

  try {
    const [result] = await mysqlDb.getConnection().query<ResultSetHeader[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    const products = result;

    if (products.length === 0) {
      return res.status(404).send({ error: 'Product not found!' });
    }

    return res.send(products[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

productsRouter.post('/', imagesUpload.single('image'), async (req, res) => {

  if (!req.body.name || !req.body.category_id || !req.body.location_id) {
    return res.status(400).send({ error: 'Name, category_id, and location_id are required!' });
  }

  const product: ProductMutation = {
    name: req.body.name,
    category_id: req.body.category_id,
    location_id: req.body.location_id,
    description: req.body.description || null,
    photo: req.file ? req.file.filename : null,
    date: new Date().toISOString(),
  };

  try {

    const [insertResult] = await mysqlDb.getConnection().query<ResultSetHeader>(
      'INSERT INTO products (name, category_id, location_id, description, photo, date) VALUES (?, ?, ?, ?, ?, ?)',
      [product.name, product.category_id, product.location_id, product.description, product.photo, product.date]
    );

    const [getNewResult] = await mysqlDb.getConnection().query<ResultSetHeader[]>(
      'SELECT * FROM products WHERE id = ?',
      [insertResult.insertId]
    );

    return res.send(getNewResult[0]);
  } catch (error) {
    console.error('Error inserting product:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

productsRouter.put('/:id', imagesUpload.single('image'), async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send({ error: 'Invalid product ID!' });
  }

  if (!req.body.name || !req.body.category_id || !req.body.location_id) {
    return res.status(400).send({ error: 'Name, category_id, and location_id are required!' });
  }

  const product: ProductMutation = {
    name: req.body.name,
    category_id: parseInt(req.body.category_id, 10),
    location_id: parseInt(req.body.location_id, 10),
    description: req.body.description || null,
    photo: req.file ? req.file.filename : null,
    date: new Date().toISOString(),
  };

  if (isNaN(product.category_id) || isNaN(product.location_id)) {
    return res.status(400).send({ error: 'Invalid category_id or location_id!' });
  }

  try {
    const [updateResult] = await mysqlDb.getConnection().query<ResultSetHeader>(
      'UPDATE products SET name = ?, category_id = ?, location_id = ?, description = ?, photo = ?, date = ? WHERE id = ?',
      [product.name, product.category_id, product.location_id, product.description, product.photo, product.date, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).send({ error: 'Product not found!' });
    }

    const [getUpdatedResult] = await mysqlDb.getConnection().query<ResultSetHeader[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    return res.send(getUpdatedResult[0]);
  } catch (error) {
    console.error('Error operation::', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

productsRouter.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send({ error: 'Invalid product ID!' });
  }

  try {
    const [deleteResult] = await mysqlDb.getConnection().query<ResultSetHeader>(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    if (deleteResult.affectedRows === 0) {
      return res.status(404).send({ error: 'Product not found!' });
    }

    return res.send({ message: 'Product deleted successfully!' });
  } catch (error) {
    console.error('Error operation::', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});
export default productsRouter;
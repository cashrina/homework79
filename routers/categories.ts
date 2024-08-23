import express from "express";
import mysqlDb from '../mysqlDb';
import {Category, CategoryMutation} from '../types';
import {ResultSetHeader, RowDataPacket} from 'mysql2';

const categoriesRouter = express.Router();


categoriesRouter.get("/", async (_req, res, next) => {
  try {
    const result = await mysqlDb.getConnection().query("SELECT * FROM category");
    const category: Category[] = result[0] as Category[];
    return res.send(category);
  } catch (e) {
    next(e);
  }
})

categoriesRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send({ error: 'Invalid category ID' });
  }

  try {
    const connection = mysqlDb.getConnection();

    const getResult = await connection.query<RowDataPacket[]>(
      'SELECT * FROM category WHERE id = ?',
      [id]
    );

    const category = getResult[0] as Category[];

    if (category.length === 0) {
      return res.status(404).send({ error: 'Category not found!' });
    }

    return res.send(category[0]);
  } catch (error) {
    console.error('Error operation:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});


categoriesRouter.post('/', async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({ error: 'Name is required!' });
  }

  const categoryMutation: CategoryMutation = {
    name: req.body.name,
    description: req.body.description || null,
  };

  try {
    const connection = mysqlDb.getConnection();

    const insertResult = await connection.query<ResultSetHeader>(
      'INSERT INTO category(name, description) VALUES (?, ?)',
      [categoryMutation.name, categoryMutation.description]
    );

    const insertId = insertResult[0].insertId;

    const getNewResult = await connection.query<RowDataPacket[]>(
      'SELECT * FROM category WHERE id = ?',
      [insertId]
    );

    const category = getNewResult[0] as Category[];

    if (category.length === 0) {
      return res.status(404).send({ error: 'Category not found!' });
    }

    return res.status(201).send(category[0]);
  } catch (error) {
    console.error('Error operation:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

export default categoriesRouter;
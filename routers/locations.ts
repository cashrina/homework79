import express from "express";
import mysqlDb from '../mysqlDb';
import {Location, LocationMutation} from '../types';
import {ResultSetHeader, RowDataPacket} from 'mysql2';

const locationRouter = express.Router();


locationRouter.get("/", async (_req, res, next) => {
  try {
    const result = await mysqlDb.getConnection().query("SELECT id, name FROM location");
    const location: Location[] = result[0] as Location[];
    return res.send(location);
  } catch (e) {
    next(e);
  }
})

locationRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send({ error: 'Invalid location ID' });
  }

  try {
    const connection = mysqlDb.getConnection();

    const getResult = await connection.query<RowDataPacket[]>(
      'SELECT * FROM location WHERE id = ?',
      [id]
    );

    const location = getResult[0] as Location[];

    if (location.length === 0) {
      return res.status(404).send({ error: 'Location not found!' });
    }

    return res.send(location[0]);
  } catch (error) {
    console.error('Error operation:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});


locationRouter.post('/', async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({ error: 'Name is required!' });
  }

  const locationMutation: LocationMutation = {
    name: req.body.name,
    description: req.body.description || null,
  };

  try {
    const connection = mysqlDb.getConnection();

    const insertResult = await connection.query<ResultSetHeader>(
      'INSERT INTO location(name, description) VALUES (?, ?)',
      [locationMutation.name, locationMutation.description]
    );

    const insertId = insertResult[0].insertId;

    const getNewResult = await connection.query<RowDataPacket[]>(
      'SELECT * FROM location WHERE id = ?',
      [insertId]
    );

    const location = getNewResult[0] as Location[];

    if (location.length === 0) {
      return res.status(404).send({ error: 'Location not found!' });
    }

    return res.status(201).send(location[0]);
  } catch (error) {
    console.error('Error operation:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

locationRouter.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send({ error: 'Invalid location ID' });
  }

  if (!req.body.name) {
    return res.status(400).send({ error: 'Name is required!' });
  }

  const locationMutation: LocationMutation = {
    name: req.body.name,
    description: req.body.description || null,
  };

  try {
    const connection = mysqlDb.getConnection();

    const [updateResult] = await connection.query<ResultSetHeader>(
      'UPDATE location SET name = ?, description = ? WHERE id = ?',
      [locationMutation.name, locationMutation.description, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).send({ error: 'Location not found!' });
    }

    const [getUpdatedResult] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM location WHERE id = ?',
      [id]
    );

    const location = getUpdatedResult as Location[];

    if (location.length === 0) {
      return res.status(404).send({ error: 'Location not found!' });
    }

    return res.send(location[0]);
  } catch (error) {
    console.error('Error operation:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

locationRouter.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send({ error: 'Invalid location ID' });
  }

  try {
    const connection = mysqlDb.getConnection();

    const [deleteResult] = await connection.query<ResultSetHeader>(
      'DELETE FROM location WHERE id = ?',
      [id]
    );

    if (deleteResult.affectedRows === 0) {
      return res.status(404).send({ error: 'Location not found!' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error operation:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});
export default locationRouter;
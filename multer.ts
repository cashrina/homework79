import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

const imagesDir = path.join(__dirname, 'public', 'images');

const ensureImagesDirExists = async () => {
  try {
    await fs.mkdir(imagesDir, { recursive: true });
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
};

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, imagesDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const newFilename = randomUUID() + extension;
    cb(null, newFilename);
  },
});

export const imagesUpload = multer({ storage: imageStorage });

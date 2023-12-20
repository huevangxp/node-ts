import express from 'express';
import { createPhoto } from '../controllers/photoEntity';

const router = express.Router();

router.post('/create-photo', createPhoto);

export default router;
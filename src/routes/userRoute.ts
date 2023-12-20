import express from 'express';
import {createUser, getAllUser, getOneUser, updateUser, login } from '../controllers/userController';
// import {user} from './user';

const router = express.Router();

router.post('/user', createUser);
router.get('/get-user', getAllUser);
router.post('/login', login);

export default router;
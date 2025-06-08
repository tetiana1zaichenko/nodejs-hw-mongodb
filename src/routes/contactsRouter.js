import express from 'express';
import { getContactsController } from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', getContactsController);

export default router;

import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
} from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper';

const router = Router();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));

export default router;

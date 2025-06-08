import { Contact } from '../models/contactModel.js';

export async function getAllContactsService() {
  return await Contact.find();
}

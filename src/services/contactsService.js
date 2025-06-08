import { Contact } from '../models/contactModel.js';

export async function getAllContactsService() {
  return await Contact.find();
}

export async function getContactByIdService(contactId) {
  return await Contact.findById(contactId);
}

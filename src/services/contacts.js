import { ContactsModel } from '../models/contactModel.js';

export async function getAllContactsService() {
  return await ContactsModel.find();
}

export async function getContactByIdService(contactId) {
  return await ContactsModel.findById(contactId);
}

export const createContact = async (payload) => {
  const contact = await ContactsModel.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const updated = await ContactsModel.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
  return updated;
};

import { ContactsModel } from '../models/contactModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getAllContactsService({ page, perPage }) {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsModel.find();
  const contactsCount = await ContactsModel.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery.skip(skip).limit(limit).exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
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

export const deleteContact = async (contactId) => {
  const contact = await ContactsModel.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};

import { ContactsModel } from '../models/contactModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export async function getAllContactsService({
  userId,
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  type,
  isFavourite,
}) {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const filter = { userId };
  // const filter = {};

  if (type) {
    filter.contactType = type;
  }

  if (typeof isFavourite !== 'undefined') {
    filter.isFavourite = String(isFavourite).toLowerCase() === 'true';
  }

  const contactsQuery = ContactsModel.find(filter);
  const contactsCount = await ContactsModel.find(filter)
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
}

export async function getContactByIdService(contactId, userId) {
  return await ContactsModel.findOne({ _id: contactId, userId });
}

export const createContact = async (payload) => {
  const contact = await ContactsModel.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, userId) => {
  const updated = await ContactsModel.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
  return updated;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsModel.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};

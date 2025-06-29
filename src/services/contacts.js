import { ContactsModel } from '../models/contactModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export async function getAllContactsService({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  type,
  isFavourite,
}) {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const filter = {};

  if (type) {
    filter.contactType = type;
  }

  if (typeof isFavourite !== 'undefined') {
    // перетворюємо "true" або "false" з query на boolean
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

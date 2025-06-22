import {
  getAllContactsService,
  getContactByIdService,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import createHttpError from 'http-errors';

export async function getContactsController(req, res, next) {
  try {
    const contacts = await getAllContactsService();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}

export async function getContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;

    const contact = await getContactByIdService(contactId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
      throw createHttpError(
        400,
        'Missing required fields: name, phoneNumber, or contactType',
      );
    }

    const contact = await createContact(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);
    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const student = await deleteContact(contactId);

  if (!student) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};

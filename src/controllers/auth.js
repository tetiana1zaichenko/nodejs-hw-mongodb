import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';
import { refreshSession } from '../services/auth.js';
import createHttpError from 'http-errors';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  const { _id, name, email, createdAt, updatedAt } = user;

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: { _id, name, email, createdAt, updatedAt },
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
  });
};

export const refreshSessionController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token provided');
  }

  const session = await refreshSession(refreshToken);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

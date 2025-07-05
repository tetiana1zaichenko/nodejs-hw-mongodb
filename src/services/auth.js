import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../models/user.js';
import { randomBytes } from 'crypto';

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../models/session.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id.toString(),
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshSession = async (refreshToken) => {
  const oldSession = await SessionsCollection.findOne({ refreshToken });

  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (oldSession.refreshTokenValidUntil < new Date()) {
    await SessionsCollection.findByIdAndDelete(oldSession._id);
    throw createHttpError(401, 'Refresh token expired');
  }

  // const user = await UsersCollection.findById(oldSession.userId);
  const user = await UsersCollection.findOne({ _id: oldSession.userId });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  await SessionsCollection.findByIdAndDelete(oldSession._id);

  const newAccessToken = randomBytes(30).toString('base64');
  const newRefreshToken = randomBytes(30).toString('base64');

  const newSession = await SessionsCollection.create({
    userId: user._id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return newSession;
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

import jwt from "jsonwebtoken";
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const blacklistRefreshToken = async (token) => {
  await knex('blacklisted_tokens').insert({
    token,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

const isTokenBlacklisted = async (token) => {
  const blacklistedToken = await knex('blacklisted_tokens').where('token', token).first();
  return blacklistedToken !== undefined;
};

const generateToken = (user, secret, expiresIn) => {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secret,
      { expiresIn }
    );
  };

export { blacklistRefreshToken, isTokenBlacklisted, generateToken };

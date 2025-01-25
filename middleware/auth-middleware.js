import jwt from "jsonwebtoken";
import initKnex from "knex";
import configuration from "../knexfile.js";
import { isTokenBlacklisted, generateToken } from "../utils/auth-utils";
const knex = initKnex(configuration);

const authenticateJWT = async (req, res, next) => {
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.cookies.accessToken;

  if (!token) {
    return res.status(403).send("Access denied: No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      if (req.path === "/auth/refresh-token") {
        const refreshToken =
          req.cookies.refreshToken ||
          req.header("Authorization")?.replace("Bearer ", "");

        if (!refreshToken) {
          return res
            .status(403)
            .send("Refresh token is required to obtain a new access token");
        }

        if (await isTokenBlacklisted(refreshToken)) {
          return res
            .status(401)
            .send("Refresh token has been revoked. Please log in again.");
        }

        try {
          const decodedRefresh = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET_REFRESH
          );

          const user = await knex("users")
            .where("id", decodedRefresh.id)
            .first();
          if (!user) return res.status(403).send("User not found");

          const newAccessToken = jwt.sign(
            {
              id: decodedRefresh.id,
              username: decodedRefresh.username,
              role: decodedRefresh.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          res.json({ accessToken: newAccessToken });
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          return res
            .status(403)
            .send("Invalid or expired refresh token. Please log in again.");
        }
      } else {
        return res.status(401).send("Token expired. Please log in again.");
      }
    } else {
      console.error(error);
      res.status(400).send("Invalid or expired token");
    }
  }
};

export { authenticateJWT };

import initKnex from "knex";
import configuration from "../knexfile.js";
import { blacklistRefreshToken } from "../utils/auth-utils.js";
const knex = initKnex(configuration);

const deleteUser = async (req, res) => {
  const { id } = req.user;
  const refreshToken = req.cookies.refreshToken;

  try {
    const user = await knex("users").where("id", id).first();
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (refreshToken) {
      await blacklistRefreshToken(refreshToken);
    }

    await knex("users").where("id", id).del();
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
    });

    res.status(200).send("User deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while trying to delete the user");
  }
};

export { deleteUser };

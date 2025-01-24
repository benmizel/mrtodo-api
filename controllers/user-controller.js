import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const deleteUser = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await knex("users").where("id", id).first();
    if (!user) {
      return res.status(404).send("User not found");
    }

    await knex("users").where("id", id).del();

    res.status(200).send("User deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while trying to delete the user");
  }
};

export { deleteUser };

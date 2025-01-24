import initKnex from "knex";
import configuration from "../knexfile.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const knex = initKnex(configuration);

const signUp = async (req, res) => {
  const { username, password } = req.body;
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  if (!usernameRegex.test(username)) {
    return res
      .status(400)
      .send("Username must be alphanumeric and between 3 and 30 characters.");
  }

  const userExists = await knex("users").where("username", username).first();
  if (userExists) {
    return res.status(400).send("Username is already taken");
  }

  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .send(
        "Password must contain at least 8 characters, and contain one letter, one number, one special character, and one uppercase letter."
      );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await knex("users")
      .insert({
        username,
        password: hashedPassword,
      })
      .returning("*");

    res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An unexpected error occurred. Please try again later.");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const user = await knex("users").where("username", username).first();
    if (!user) return res.status(400).send("Invalid username");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken= jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET_REFRESH,
      { expiresIn: "30d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!refreshToken) {
    return res.status(403).send("Refresh token is required");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

    const user = await knex("users").where("id", decoded.id).first();
    if (!user) return res.status(403).send("User not found");

    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const newRefreshToken = jwt.sign(
      { id: decoded.id, username: decoded.username, role: decoded.role },
      process.env.JWT_SECRET_REFRESH,
      { expiresIn: "30d" }
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(403).send("Invalid or expired refresh token. Please log in again.");
  }
};

const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
  res.status(200).send("Logged out successfully");
};

export { signUp, login, refreshToken, logout };

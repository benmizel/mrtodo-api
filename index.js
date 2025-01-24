import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth-routes.js";
import userRouter from "./routes/user-routes.js";

const app = express();
let { CROSS_ORIGIN } = process.env;
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: CROSS_ORIGIN }));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get('/', (req, res) => {
    res.send('Mr. To Do API');
  });

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
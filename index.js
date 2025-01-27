import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth-routes.js";
import userRouter from "./routes/user-routes.js";
import taskRouter from "./routes/tasks-routes.js";


const app = express();
let { CROSS_ORIGIN } = process.env;
const PORT = process.env.PORT || 8080;

const corsOptions = {
    origin: CROSS_ORIGIN,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/task", taskRouter);


app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
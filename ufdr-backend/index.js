import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/user.routes.js";
import router2 from "./routes/ufdrfile.route.js";
const app = express();
app.use(cors({
    origin: [`http://localhost:5173`,`${process.env.frontend}`],
    credentials: true,
    methods: ["GET", "POST","PUT","DELETE"],}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/user", router);
app.use("/ufdr", router2);
export default app;


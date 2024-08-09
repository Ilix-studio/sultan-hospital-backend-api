import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import appointmentFormRoute from "./routes/appointmentFormRoute.js";
import loginRoutes from "./routes/loginRoute.js";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";
import connectDB from "./mongoDb/connection.js";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions.js";

// import seedAdmin from "./AdminPrivilege/seeder.js";
const port = 5000;

dotenv.config();
connectDB();
// seedAdmin();

const app = express();

//use middleware
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));

app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.send("server is ready"));
app.use("/api/form", appointmentFormRoute);
app.use("/api/admin", loginRoutes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

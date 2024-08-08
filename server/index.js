import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//use middleware
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/form", appointmentFormRoute);
app.use("/api/admin", loginRoutes);
app.use(routeNotFound);
app.use(errorHandler);

//serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../", "client", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.get("/", (req, res) => res.send("server is ready"));

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

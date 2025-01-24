import express from "express";
import connectDB from "../Database/modules/mongoservice.js";
import UserRoutes from "./Routes/UserRoute.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", UserRoutes);

app.listen(3200, () => {
  console.log("Server is running on port 3000");
});

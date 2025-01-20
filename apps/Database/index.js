import express from "express";
import connectDB from "./modules/mongoservice.js";
import supabase from "./modules/supabase.js";

connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

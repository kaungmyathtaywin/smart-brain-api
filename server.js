import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt";
import handleRegister from "./controllers/register.js";
import handleSignin from "./controllers/signin.js";
import handleProfile from "./controllers/profile.js";
import { handleImage, handleApiCall } from "./controllers/image.js";

// Database
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello World");
});

app.post("/signin", (req, res) => {
  handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  handleProfile(req, res, db);
});

app.post("/imageurl", (req, res) => {
  handleApiCall(req, res);
});

app.put("/image", (req, res) => {
  handleImage(req, res, db);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

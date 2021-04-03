import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt";

const app = express();

// Database
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "kaungmyathtaywin",
    password: "",
    database: "smart-brain",
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello World");
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  db.select("email", "hash")
    .from("login")
    .where({ email: email })
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where({ email: email })
          .then((user) => {
            res.json(user[0]);
          })
          .catch((error) => {
            res.status(400).json("Could not find user");
          });
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch((error) => {
      res.status(400).json("Invaid credentials");
    });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);

  db.transaction((trx) => {
    trx("login")
      .insert({
        hash: hash,
        email: email,
      })
      .returning("email")
      .then((loginEmail) => {
        return db("users")
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .returning("*")
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((error) => {
    res.status(400).json("Could not register");
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("No such user");
      }
    })
    .catch((error) => {
      res.status(400).json("Error getting user");
    });
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where({ id: id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((error) => {
      res.status(400).json("Unable to get entries");
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

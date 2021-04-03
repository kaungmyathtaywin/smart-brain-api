import express from "express";
import cors from "cors";
import knex from "knex";

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

const database = {
  users: [
    {
      id: "123",
      name: "John Doe",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Doe",
      email: "doe@gmail.com",
      password: "monster",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.json(database.users);
});

app.post("/signin", (req, res) => {
  console.log(req.body);
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).send("Error logging in");
  }
});

app.post("/register", (req, res) => {
  const { name, email } = req.body;

  db("users")
    .returning("*")
    .insert({
      name: name,
      email: email,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((error) => {
      res.status(400).json("Coult not register");
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
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if (!found) {
    res.status(400).send("No such user");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

/*
/signin => POST > success/fail
/register => POST > user
/profile/:id => GET > user
/image => PUT > user
*/

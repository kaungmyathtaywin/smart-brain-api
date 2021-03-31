import express from "express";
import cors from "cors";

const app = express();

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
  database.users.push({
    id: "125",
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });

  if (!found) {
    res.status(400).send("No such user");
  }
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

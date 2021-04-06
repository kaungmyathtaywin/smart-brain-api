export default function handleRegister(req, res, db, bcrypt) {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json("Incorrect form submission");
  }

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
}

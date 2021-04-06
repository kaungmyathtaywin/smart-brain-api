import Clarifai from "clarifai";

const handleImage = (req, res, db) => {
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
};

const handleApiCall = (req, res) => {
  const { input } = req.body;

  const app = new Clarifai.App({
    apiKey: "7e5e61f2de614ba8bdb79706e4756ff5",
  });

  const FACE_DETECTION_MODEL = "d02b4508df58432fbb84e800597b8959";
  app.models
    .predict(FACE_DETECTION_MODEL, input)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => res.status(400).json("Could not work with API"));
};

export { handleImage, handleApiCall };

const express = require("express");
const bodyParser = require("body-parser");

// Configure multer so that it will upload to '../front-end/public/images'
const multer = require("multer");
const upload = multer({
  dest: "../front-end/public/images/",
  limits: {
    fileSize: 10000000,
  },
});

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const mongoose = require("mongoose");

// connect to the database
mongoose.connect("mongodb://localhost:27017/hikes", {
  useNewUrlParser: true,
});

// Create a scheme for items in the hikes: a title and a path to an image.
const hikeSchema = new mongoose.Schema({
  title: String,
  imagePath: String,
  description: String,
});

const hikerSchema = new mongoose.Schema({
  name: String,
  imagePath: String,
  biography: String,
});

// Create a model for items in the hikes and hikers.
const Hike = mongoose.model("Hike", hikeSchema);
const Hiker = mongoose.model("Hiker", hikerSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post("/api/hikes/photos", upload.single("photo"), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    imagePath: "/images/" + req.file.filename,
  });
});

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post("/api/hikers/photos", upload.single("photo"), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    imagePath: "/images/" + req.file.filename,
  });
});

// Create a new hike item: takes a title and a path to an image.
app.post("/api/hikes/items", async (req, res) => {
  const hike = new Hike({
    title: req.body.title,
    imagePath: req.body.imagePath,
    description: req.body.description,
  });
  try {
    await hike.save();
    res.send(hike);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Create a new hiker item: takes a title and a path to an image.
app.post("/api/hikers/items", async (req, res) => {
  const hiker = new Hiker({
    name: req.body.name,
    imagePath: req.body.imagePath,
    biography: req.body.biography,
  });
  try {
    await hiker.save();
    res.send(hiker);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the hikes.
app.get("/api/hikes/items", async (req, res) => {
  try {
    let hikes = await Hike.find();
    res.send(hikes);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the hikes.
app.get("/api/hikers/items", async (req, res) => {
  try {
    let hikers = await Hiker.find();
    res.send(hikers);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Done in class
app.delete("/api/hikes/items/:id", async (req, res) => {
  try {
    console.log("Delete " + req.params.id);
    await Hike.deleteOne({
      _id: req.params.id,
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Done in class
app.delete("/api/hikers/items/:id", async (req, res) => {
  try {
    console.log("Delete " + req.params.id);
    await Hiker.deleteOne({
      _id: req.params.id,
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put("/api/hikes/items/:id", async (req, res) => {
  try {
    console.log(req.body);
    console.log("Edit " + req.params.id);
    let hike = await Hike.findOne({
      _id: req.params.id,
    });
    hike.title = req.body.title;
    hike.description = req.body.description;
    await hike.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put("/api/hikers/items/:id", async (req, res) => {
  try {
    console.log(req.body);
    console.log("Edit " + req.params.id);
    let hiker = await Hiker.findOne({
      _id: req.params.id,
    });
    hiker.name = req.body.name;
    hiker.biography = req.body.biography;
    await hiker.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("Server listening on port 3000!"));

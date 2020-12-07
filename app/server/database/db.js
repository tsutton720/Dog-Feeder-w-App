const mongoose = require("mongoose");
const Time = require("./models/Time");

async function connectDB() {
  try {
    const conn = await mongoose.connect("MONOGODBLINK", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

async function getAllFromDB(req, res) {
  try {
    const times = await Time.find();
    console.log(times);
    return res.json(times);
  } catch (err) {
    return res.send(500).json({ error: "Server error" });
  }
}

async function deleteFromDB(req, res) {
  try {
    const id = req.params.id;
    const time = await Time.findById(id);
    console.log(id);

    if (!time) {
      res.status(404).json({ error: "No time id found" });
    }

    await time.remove();
    res.status(200).json({ msg: "Deleted" });
  } catch (err) {
    return res.json({ error: "Server error" });
  }
}

async function addToDB(req, res) {
  try {
    const { hour, min } = req.body;
    const time = await Time.create(req.body);
    res.status(201).json(time);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Server error" });
  }
}

module.exports = { connectDB, getAllFromDB, deleteFromDB, addToDB };

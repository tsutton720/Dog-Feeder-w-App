const express = require("express");
const fetch = require("node-fetch");
const router = require("./routes/api/times.js");
const db = require("./database/db");

const app = express();
const port = 5000;

db.connectDB();
app.use(express.json());
app.use("/api/times", router);

app.get("/servo", async (req, res) => {
  try {
    await fetch("http://192.168.0.24/servo");
  } catch (error) {
    console.log("cant reach esp server");
  }

  res.send("Servo route");
});

app.get("/update", async (req, res) => {
  try {
    await fetch("http://192.168.0.24");
  } catch (error) {
    console.log("cant reach esp server");
  }
  res.send("Update route");
});

// app.get("/move", (req, res) => {
//   res.send("Fetch the esp server");
//   fetch("http://192.168.0.28/servo");
// });

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});

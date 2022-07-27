const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send({ message: "HI THERE" });
});

app.listen(3000, () => console.log("Listening on port 3000"));

process.on("SIGINT", () => process.exit());
process.on("SIGTERM", () => process.exit());

const express = require("express");
const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
  console.log(req);
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`express server runnnig on port ${PORT}`);
});

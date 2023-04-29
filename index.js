const express = require("express");
const morgan = require("morgan");
const asyncErrors = require("express-async-errors");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(morgan("dev"));

const port = process.env.PORT || 3000;

const planets = [
    {
      id: 1,
      name: 'Earth'
    },
    {
      id: 2,
      name: 'Mars'
    }
  ];

app.get("/planets", (req, res) => {
  res.send(planets);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

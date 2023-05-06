const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const planetsRoutes = require("./routes/planets");

app.use(bodyParser.json());

app.use(planetsRoutes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

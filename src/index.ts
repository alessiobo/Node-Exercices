const express = require("express");
const app = express();
const planetsRouter = require("./routes/planets");

app.use(express.json());
app.use("/api/planets", planetsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

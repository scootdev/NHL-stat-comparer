const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const apiRouter = require("./routes/apiRoutes");
const htmlRouter = require("./routes/htmlRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/api", apiRouter);
app.use("/", htmlRouter);

app.listen(PORT, function() {
    console.log("Note Taker listening on PORT: " + PORT);
  });
const express = require("express");
const app = express();
const userRouter = require("./api/user/route");
require("dotenv").config();
app.use(express.json());

app.use("/api/users", userRouter);
const port = process.env.PORT || 3009;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});
const express = require("express");
const APIRouter = require("./Routes/APIRouter");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const { dbAfter, dbBefore } = require("./Routes/debugger");
const app = express();
const PORT = process.env.PORT || 5008;
const MONGODB_URI = process.env.DataBase;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", APIRouter);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Db connected successfully");
    app.listen(PORT, function () {
      console.log("Server is running on port ", PORT);
    });
  })
  .catch((error) => {
    console.log("unable to connect with DB");
    console.log(error);
  });

const mongoose = require("mongoose");

// DATABASE CONNECTION
const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => {
    console.log("connected to database succesfully");
  })
  .catch((err) => console.log(err));

const mongoose = require("mongoose");

// DATABASE VARIABLE
const DB = process.env.DATABASE;
// DATABASE CONNECTION VARIABLE
mongoose
  .connect(DB)
  .then(() => {
    console.log("connected to database succesfully");
  })
  .catch((err) => console.log(err));

const express = require("express");
const pool = require("./config/database");

const app = express();

pool.query('Select 1 + 1 As result')
  .then(() => {
    console.log("Database connection established");

    const port = 10000;

    app.listen(port, () => {
      console.log("Server is listening on port no.", port);
    });
  })
  .catch((error) => {
    console.error("Database connection failed" , error);
  });
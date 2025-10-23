const express = require("express");
const pool = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Authentication Routes
app.use('/' , authRouter);

// Profile Routes
app.use('/' , profileRouter);

// Database Connection
(async () =>{
  
  try{
    await pool.query('Select 1 + 1 As result');
    console.log("Database connection established");

    const port = 5000;

    // Starting the server
    app.listen(port, () => {
      console.log("Server is listening on port no.", port);
    });
  }
  catch(error){
    console.error("Database connection failed" , error);
  };

})();
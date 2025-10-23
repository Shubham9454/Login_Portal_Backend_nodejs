const express = require("express");
const pool = require("./config/database");
const authRouter = require("./routes/auth");

const app = express();

app.use(express.json());

// Authentication Routes
app.use('/' , authRouter);

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
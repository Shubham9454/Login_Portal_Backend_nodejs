const express = require("express");
const { validatingUserInfo } = require("../utils/validation");
const pool = require("../config/database");
const bcrypt = require('bcrypt');

const authRouter = express.Router();

// SignUp API
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailID, password, role } = req.body;

    // allowed roles
    const allowedRoles = ["normal_user", "admin"];

    validatingUserInfo(req);

    // check if user exists or not
    const [userExists] = await pool.query(
      "SELECT * FROM users WHERE emailID = ?",
      [emailID]
    );
    
    if (userExists.length > 0) {
      return res.status(400).json({
        error: "User already exists" ,
        user: userExists[0]
      });

    }

    // Generate hash password
    const hashPassword = await bcrypt.hash(password, 10);

    const userRole = allowedRoles.includes(role) ? role : "normal_user";

    // Insert user with role
    const [result] = await pool.query(
      "INSERT INTO users (firstName, lastName, emailID, password, role) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, emailID, hashPassword, userRole]
    );

    // Get the inserted user
    const [newUser] = await pool.query(
      "SELECT firstName, lastName, emailID, password, role FROM users WHERE emailID = ?",
      [emailID]
    );

    res.status(201).json({
      message: `${newUser[0].firstName} you are registered successfully !`,
      user: newUser[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Something went wrong with error message: " + error.message});
  }

});

// Login API
authRouter.post("/login" , async (req , res) =>{
    try {
        
    } catch (error) {
        
    }
});

module.exports = authRouter;

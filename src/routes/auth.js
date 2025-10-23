const express = require("express");
const { validatingUserInfo, validatingEmailID } = require("../utils/validation");
const pool = require("../config/database");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const jwt = require("jsonwebtoken");

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
        error: "User already exists",
        user: userExists[0],
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
    res
      .status(500)
      .json({
        error: "Something went wrong: " + error.message,
      });
  }
});

// Login API
authRouter.post("/login", async (req, res) => {
  try {

    const { emailID, password } = req.body;
    
    // validating the emaildID
    validatingEmailID(emailID);

    const [userExists] = await pool.query(
      "SELECT * FROM users where emailID = ?" ,
      [emailID]
    );

    if(userExists.length < 1){
      return res.status(400).json({error: "User doesn't exist"});
    }

    const user = userExists[0];

    // Check password
    const validatePassword = await bcrypt.compare(password , user.password);
    if(!validatePassword){
      return res.status(400).json({error: "Incorrect password"});
    }

    // Generate JWT
    const token = await jwt.sign(
      {emailID: user.emailID , role: user.role},
      JWT_SECRET, 
      {expiresIn: '24h'}
    );

    res.cookie("token" , token);

    res.status(200).json({
      message: "Login Succssful !",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        emailID: user.emailID,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Something went wrong: " + error.message});

  }

});

// Logout API
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    
  });
  return res.status(200).json({ message: "Logged out successfully" });
})

module.exports = authRouter;

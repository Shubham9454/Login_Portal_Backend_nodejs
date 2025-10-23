const express = require("express");
const bcrypt = require("bcrypt");
const { validatingPassword } = require("../utils/validation");
const pool = require("../config/database");
const { userAuthentication } = require("../middlewares/authentication");

const profileRouter = express.Router();


// forgot password API
profileRouter.patch("/profile/change-password" , userAuthentication , async (req , res) =>{

  try{

  const user = req.user;
  const userEmailID = user.emailID;
  const userPassword = user.password;

  const {oldPassword , newPassword , confirmPassword} = req.body;
  
  const checkPassword = await bcrypt.compare(oldPassword , userPassword);
  if(!checkPassword){
    return res.status(400).json({error: "Incorrect password"});
  }

  validatingPassword(newPassword);

  if(newPassword === confirmPassword){

    const passwordHash = await bcrypt.hash(newPassword , 10);
    const [newData] = await pool.query(
        "UPDATE users SET password = ? WHERE emailID = ?",
        [passwordHash , userEmailID]
    );
    res.status(200).json({
    message: "Password changed successfully !!",
    data: newData[0]
  });  
  }
  else 
  return res.status(400).json({error : "Confirm password doen't match with new password"});

  }
  catch(err){
    res.status(500).send("Something went wrong with error: " + err.message);
  }

});

module.exports = profileRouter;
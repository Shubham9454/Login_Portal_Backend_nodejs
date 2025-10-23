const express = require("express");
const bcrypt = require("bcrypt");
const { userAuthentication } = require("../middlewares/authentication");
const pool = require("../config/database");
const { validatingEmailID } = require("../utils/validation");

const adminRouter = express.Router();

// delete user API
adminRouter.delete("/admin/delete-user" , userAuthentication , async (req , res) =>{

    try{

        const deletingUserEmailID = req.body.userEmailID;
        const adminEnteredPassword = req.body.password;
        
        // admin details
        const {emailID , password , role} = req.user;
        
        // verify the role of admin
        if(role != "admin")
        return res.status(403).json({error: "You are not allowed to delete users"});
        
        // validate the deleting user's emailID
        validatingEmailID(deletingUserEmailID);

        // check whether the deleting user exists or not
        console.log(deletingUserEmailID);
        const [deletingUser] = await pool.query(
            "SELECT * FROM users WHERE emailID = ?",
            [deletingUserEmailID]
        );

        if(deletingUser.length < 1)
        return res.status(400).json({error: "Invalid email address"});
        
        // verify the admin's password
        const checkPassword = await bcrypt.compare(adminEnteredPassword , password);

        if(!checkPassword)
        return res.status(400).json({error: "Incorrect password"});
        
        // delete user info from database
        const [result] = await pool.query(
            "DELETE FROM users where emailID = ?" , 
            [deletingUserEmailID]
        );

        

        res.status(200).json({message: "User deleted successfully !"});

    } catch(error){
        console.error(error.message);
        res.status(500).json({error: "Something went wrong: " + error.message});
    }

});

module.exports = adminRouter;
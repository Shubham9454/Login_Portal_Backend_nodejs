const express = require('express');

const authRouter = express.Router();

// SignUp API
authRouter.post("/signup" , async (req , res) =>{

    try {
        const {firstName , lastName , emailID, password , role} = req.body;

        
        
    } catch (error) {
        
    }

})
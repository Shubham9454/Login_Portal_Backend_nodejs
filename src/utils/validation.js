const validator = require("validator");

const validatingUserInfo = (req) => {
  const data = req.body;

  if (!data.firstName || !data.lastName || !data.emailID || !data.password) {
    throw new Error("Please check, some details are missing!");
  } 
  else if (!validator.isEmail(data.emailID)) {
    throw new Error("Please enter valid email address");
  }
  else if (!validator.isStrongPassword(data.password)) {
    throw new Error("Please use strong password");
  }
};

const validatingEmailID = (emailID) => {
  if(!validator.isEmail(emailID)){
    throw new Error("Please Enter Valid email address");
  }
};

const validatingPassword = (password) =>{
  if(!validator.isStrongPassword(password)){
    throw new Error("Please enter valid password");
  }
}

const validateEditableData = (req) =>{

  const data = req.body;

  const allowedUpdates = [
      "firstName",
      "lastName",
      "password",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      return allowedUpdates.includes(k);
    });

    if (!isUpdateAllowed) {
      throw new Error("This field is not allowed to update");
    }

};

module.exports = {validatingUserInfo , validatingEmailID ,validatingPassword, validateEditableData};
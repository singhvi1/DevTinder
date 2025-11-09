const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid");
  } else if (!emailId || !password) {
    throw new Error("Invalid Data");
  } else if (!validator.isEmail(emailId.trim())) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password");
  }
};


const validateEditProfileData=(req)=>{
  const ALLOWED_UPDATES=["firstName","lastName","photoUrl", "about", "skills", "age","gender"];
  const isUpdateAllowed=Object.keys(req.body).every((key)=>ALLOWED_UPDATES.includes(key))

  return isUpdateAllowed;
}

const validateEditPassword=(req)=>{
  const allowedKeys=["currPassword","newPassword"];
  const isAllowed= Object.keys(req.body).every((key)=>allowedKeys.includes(key));
  return isAllowed;
}

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateEditPassword,
};

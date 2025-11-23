const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 30,
    },
    lastName: {
      type: String,
      maxLength: 30,
    },
    emailId: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Add a Stron Password");
        }
      },
    },
    age: {
      type: Number,
      //or by simple min and max 
      //custom validators
      validate: {
        validator: function (value) {
          return value >= 18 && value <= 65;
        },
        message: "age must be between 18 to 65 ",
      },
    },
    gender: {
      type: String,

      //custom validator
      validate(value) {
        if (!["Male", "Female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Phot Url not valid");
        }
      },
      default:
        "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    memeberShipType: {
      type: String,
    },
    about: {
      type: String,
      default: "this is default about section",
    },
    skills: {
      type: [String],
    },
    createdAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

(userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$79", {
    expiresIn: "1d",
  });
  return token;
}),
  //check the the given password matches with hashed db password;
  (userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(
      passwordInputByUser,
      user.password
    );
    return isPasswordValid;
  });
module.exports = mongoose.model("User", userSchema);

/**const User =mongoose.model("User",userSchema)
 * module.exports={User}
 */

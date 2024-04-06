import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // If you want usernames to be unique, keep this option
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // If you want emails to be unique, keep this option
    },
    phoneNo: {
      type: String,
      required: true,
    },
    contacts: [{
      type: String
    }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // if password is not changed by user then don't bcrypt the password again
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// check password
userSchema.methods.isPasswordCorrect = async function (password : string) {
    return await bcrypt.compare(password, this.password);
  };

// get and sign accessToken
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// get and sign refreshToken
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  };



const User = mongoose.model("User", userSchema);

export default User;

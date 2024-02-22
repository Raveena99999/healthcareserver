const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Model/User.Model");
const { BlacklistModel } = require("../Model/BlackList.Model");
const { auth } = require("../Middlewares/Auth.middleware");
const cookieParser = require("cookie-parser");
const userRouter = express.Router();
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;


userRouter.use(cookieParser());
userRouter.post("/register", async (req, res) => {
  try {
    const { pass } = req.body;
    bcrypt.hash(pass, 5, async function (err, hash) {
      if (err) {
        res.status(400).send({ msg: err.message });
      } else {
        const user = new UserModel({ ...req.body, pass: hash });
        await user.save();
        res.status(200).send({ msg: `user created successfully` });
      }
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(pass, user.pass, function (err, result) {
        if (result) {
          var accessToken = jwt.sign(
            { userId: user._id, username: user.username },
            accessTokenKey,
            {
              expiresIn: "1h",
            }
          );
          var refreshToken = jwt.sign(
            { userId: user._id, username: user.username },
            refreshTokenKey,
            {
              expiresIn: "1d",
            }
          );
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });
          res.status(200).send({ msg: "Login Successful" });
        } else {
          res.status(400).send({ msg: "Wrong Password" });
        }
      });
    } else {
      res.status(400).send({ msg: "user not found" });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});


userRouter.get("/logout", auth, async (req, res) => {
  try {
    const accessToken = req.cookies["accessToken"];
    const refreshToken = req.cookies["refreshToken"];
    const blacklist = new BlacklistModel({
      accessToken,
      refreshToken,
    });
    await blacklist.save();
    res.status(200).send({ msg: `Logged out successfully` });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = { userRouter };

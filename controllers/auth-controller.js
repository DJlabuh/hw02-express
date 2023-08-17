import fs from "fs/promises";
import path from "path";
import jimp from "jimp";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

import gravatar from "gravatar";

import User from "../models/user.js";

import { ctrlWrapper } from "../decorators/index.js";

import { HttpError, sendEmail, createVerifyEmail } from "../helpers/index.js";

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();

  let avatarURL = "";

  if (req.file) {
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);

    const image = await jimp.read(oldPath);
    await image.cover(250, 250).writeAsync(newPath);

    await fs.rename(oldPath, newPath);

    avatarURL = path.join("avatars", filename);
  } else {
    avatarURL = gravatar.url(email, {
      s: "250",
      r: "pg",
      d: "wavatar",
      ext: "jpg",
    });
  }

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken: verificationCode,
  });

  const verifyEmail = createVerifyEmail({ email, verificationCode });

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      avatarURL: newUser.avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = createVerifyEmail({
    email,
    verificationCode: user.verificationCode,
  });

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Signout ssucess",
  });
};

const updatesubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const user = await User.findById(_id);
  if (user.subscription === subscription) {
    throw HttpError(400, `Subscription already set to '${subscription}'.`);
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );

  res.json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);

  const image = await jimp.read(oldPath);
  await image.cover(250, 250).writeAsync(newPath);

  await fs.rename(oldPath, newPath);

  await User.findByIdAndUpdate(_id, { avatarURL: `avatars/${filename}` });

  res.json({
    avatarURL: `avatars/${filename}`,
  });
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updatesubscription: ctrlWrapper(updatesubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};

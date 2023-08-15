import fs from "fs/promises";
import path from "path";
import jimp from "jimp";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import gravatar from "gravatar";

import User from "../models/user.js";

import { ctrlWrapper } from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

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
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      avatarURL: newUser.avatarURL,
    },
  });
};

const login = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updatesubscription: ctrlWrapper(updatesubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};

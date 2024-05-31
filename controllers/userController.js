import * as fs from "node:fs/promises";
import User from "../models/user.js";
import path from "path";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";

export async function uploadAvatar(req, res, next) {
  try {
    const filePath = req.file.path;

    const newPath = path.resolve("public/avatars", req.file.filename);
    await fs.rename(filePath, newPath);

    const image = await Jimp.read(newPath);
    await image.resize(250, 250).writeAsync(newPath);

    const user = await User.findByIdAndUpdate(
      {
        _id: req.user.id,
      },
      { avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    );
    res.status(200).send({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

export async function verifyUserByToken(req, res, next) {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) throw HttpError(404);

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

export async function reVerify(req, res, next) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw HttpError(404, "User not found");

    if (user.verify)
      throw HttpError(400, "Verification has already been passed");

    const verificationToken = user.verificationToken;

    await mail(email, verificationToken);

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}

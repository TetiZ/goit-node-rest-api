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
  const { token } = req.params;
  try {
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
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ message: "missing required field email" });
  }
  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .send({ message: "Verification has already been passed" });
    }

    const verificationToken = user.verificationToken;

    mail.sendMail({
      to: emailInLowerCase,
      from: "tommytaba99@gmail.com",
      subject: "Welcome to Contacts!",
      html: `To confirm your email, please follow the <a href="http://localhost:3000/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your email, please open the link http://localhost:3000/users/verify/${verificationToken}`,
    });

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}

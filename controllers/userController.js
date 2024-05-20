import * as fs from "node:fs/promises";
import User from "../models/user.js";
import path from "path";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.user) throw HttpError(401, "Not authorized");

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

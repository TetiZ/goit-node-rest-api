import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

export async function userRegister(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) throw HttpError(409, "Email in use");

    const passHash = await bcrypt.hash(password, 10);
    const avatar = gravatar.url(email);
    const newUser = await User.create({
      name,
      email,
      password: passHash,
      avatarURL: `http:${avatar}`,
    });

    const response = {
      user: { email: newUser.email, subscription: newUser.subscription },
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function userLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw HttpError(401, "Email or password is wrong");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw HttpError(401, "Email or password is wrong");

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    await User.findByIdAndUpdate(user._id, { token });

    const response = {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function userLogout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).send({ message: "Status: 204 No Content" }).end();
  } catch (error) {
    next(error);
  }
}

export async function userByToken(req, res, next) {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
}

import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function userRegister(req, res, next) {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user !== null) throw HttpError(409, "Email in use");

    const passHash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: passHash });

    res.status(201).send({ message: "Registration succesfully" });
  } catch (error) {
    next(error);
  }
}

export async function userLogin(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user === null) throw HttpError(401, "Email or password is wrong");

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) throw HttpError(401, "Email or password is wrong");

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
}

export async function userLogout(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) throw new HttpError(401, "Not authorized");

    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).send({ message: "Status: 204 No Content" });
  } catch (error) {
    next(error);
  }
}

export async function userByToken(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) throw new HttpError(401, "Not authorized");

    res.status(200).send({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
}

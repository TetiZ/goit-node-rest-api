import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) throw HttpError(401, "Not authorized");

    const [bearer, token] = authHeader.split(" ", 2);
    if (bearer !== "Bearer") throw HttpError(401, "Not authorized");

    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);

    if (!user) throw HttpError(401, "Not authorized");

    if (user.token !== token) throw HttpError(401, "Not authorized");

    req.user = {
      id: user._id,
      name: user.name,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export default auth;

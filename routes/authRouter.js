import express from "express";
import {
  userRegister,
  userLogin,
  userLogout,
  userByToken,
} from "../controllers/authControllers.js";

import { uploadAvatar } from "../controllers/userController.js";

import authMiddleware from "../middleware/auth.js";
import uploadMiddleware from "../middleware/upload.js";

import validateBody from "../helpers/validateBody.js";

import { registerUserSchema, loginUserSchema } from "../schemas/authSchemas.js";

const userRouter = express.Router();

userRouter.post("/register", validateBody(registerUserSchema), userRegister);

userRouter.post("/login", validateBody(loginUserSchema), userLogin);

userRouter.post("/logout", authMiddleware, userLogout);

userRouter.get("/current", authMiddleware, userByToken);

userRouter.patch("/avatar", uploadMiddleware.single("avatarURL"), uploadAvatar);

export default userRouter;

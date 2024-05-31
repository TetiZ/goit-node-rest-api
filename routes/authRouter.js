import express from "express";
import {
  userRegister,
  userLogin,
  userLogout,
  userByToken,
} from "../controllers/authControllers.js";

import {
  uploadAvatar,
  verifyUserByToken,
  reVerify,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/auth.js";
import uploadMiddleware from "../middleware/upload.js";

import validateBody from "../helpers/validateBody.js";

import {
  registerUserSchema,
  loginUserSchema,
  emailCheckSchema,
} from "../schemas/authSchemas.js";

const userRouter = express.Router();

userRouter.post("/register", validateBody(registerUserSchema), userRegister);

userRouter.post("/login", validateBody(loginUserSchema), userLogin);

userRouter.post("/logout", authMiddleware, userLogout);

userRouter.get("/current", authMiddleware, userByToken);

userRouter.patch(
  "/avatar",
  authMiddleware,
  uploadMiddleware.single("avatarURL"),
  uploadAvatar
);

userRouter.get("/verify/:verificationToken", verifyUserByToken);
userRouter.post("/verify", validateBody(emailCheckSchema), reVerify);

export default userRouter;

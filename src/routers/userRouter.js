import express from "express";
import { edit, logout, see,startGithubLogin,finishGithubLogin, getEdit, postEdit, getChangePassword, postChangePassword } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout",protectorMiddleware,logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"),postEdit);
userRouter.get("/:id",see);
userRouter.get("/github/start", publicOnlyMiddleware,startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleware, finishGithubLogin);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);

export default userRouter;
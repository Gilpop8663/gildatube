import express from "express";
import { createComment, deleteComment, registerView } from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete(`/videos/:commentId([0-9a-f]{24})/delete`,deleteComment);

export default apiRouter;
import express from "express";
import { getJoin,postJoin, getLogin, postLogin } from "../controllers/userController";
import { home,search} from "../controllers/videoController";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/",home);
rootRouter.get("/search", search);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin)


export default rootRouter;
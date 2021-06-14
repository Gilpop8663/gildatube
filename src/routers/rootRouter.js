import express from "express";
import { getJoin,postJoin, getLogin, postLogin } from "../controllers/userController";
import { home,search} from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/",home);
rootRouter.get("/search", search);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin)


export default rootRouter;
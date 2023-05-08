import express from "express";
import { home } from "../controllers/songController";
import { library } from "../controllers/songController";
import { search } from "../controllers/songController";
import { playlist } from "../controllers/songController";
import { profile } from "../controllers/songController";


const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.get("/library", library);
rootRouter.get("/playlist", playlist);
rootRouter.get("/profile", profile)

export default rootRouter;

import express from "express";
import { home } from "../controllers/songController";
import { library } from "../controllers/songController";
import { search } from "../controllers/songController";
import { playlist } from "../controllers/songController";
import { profile } from "../controllers/songController";
import Composer from "../models/Composer";
import User from "../models/User";
import Work from "../models/Work";



const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.get("/library", library);
rootRouter.get("/playlist", playlist);
rootRouter.get("/profile", profile);


rootRouter.get('/update', (req, res) => {
    // const work = new Work({
    //     title: "test",
    //     composer: "test",
    //     view: 0,
    //     performer: "test",
    //     time: "test",
    //     character: "test"
    // });

    // work.save()
    //     .then((result) => {
    //         res.send(result)
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     })

    // Song.find()
    //     .then((result) => {
    //         res.send(result);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     })

    // const user = new User({
    //     userEmail: "test",
    //     userPassword: "test",
    //     username: "test"
    // });

    // user.save()
    //     .then((result) => {
    //         res.send(result)
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     })
})



export default rootRouter;

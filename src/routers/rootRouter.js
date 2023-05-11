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


rootRouter.get('/update', async (req, res) => {
    try {
        const works = await Work.find({ videoId: { $exists: true } });

        for (let i = 0; i < works.length; i++) {
            const apiKey = process.env.API_KEY;
            const videoId = works[i].videoId;
            const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;

            const response = await fetch(url);
            const data = await response.json();
            const thumbnails = data.items[0].snippet.thumbnails;
            let thumbnailUrl;

            if (thumbnails.maxres) {
                thumbnailUrl = thumbnails.maxres.url;
            } else if (thumbnails.high) {
                thumbnailUrl = thumbnails.high.url;
            } else {
                // 기본 크기의 썸네일을 사용하거나 다른 처리를 수행합니다.
                thumbnailUrl = thumbnails.default.url;
            }

            // const thumbnailUrl = data.items[0].snippet.thumbnails.default.url;

            works[i].thumbnail = thumbnailUrl;
            await works[i].save();

            console.log(`Thumbnail URL for videoId ${videoId} has been updated.`);
        }


        res.send("Thumbnail update completed");
    } catch (error) {
        console.error('An error occurred during thumbnail update:', error);
        res.status(500).send('Thumbnail update failed.');
    }

});

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



export default rootRouter;

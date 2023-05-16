import express from "express";
import { home } from "../controllers/songController";
import { library } from "../controllers/songController";
import { search } from "../controllers/songController";
import { playlist } from "../controllers/songController";
import { profile } from "../controllers/songController";
import { register } from "../controllers/songController";
import { result } from "../controllers/songController";
import Composer from "../models/Composer";
import User from "../models/User";
import Work from "../models/Work";
import bcrypt from 'bcrypt';



const rootRouter = express.Router();
let searchResult = [];

rootRouter.get("/", home);
rootRouter.get("/", (req, res) => {
    res.cookie('cookieName', 'cookieValue', { sameSite: 'None', secure: true });
})
rootRouter.get("/search", search);
rootRouter.get("/library", library);
rootRouter.get("/playlist", playlist);
rootRouter.get("/profile", profile);
rootRouter.get("/register", register);

rootRouter.post('/signup', async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let newUser = new User({ email, password: hashedPassword, username });

        await newUser.save();
        res.redirect('/profile');
    } catch (error) {
        res.status(500).json({ error: 'failed to sign up' })
    }
})

// rootRouter.post('/addSongToHistory', (req, res) => {
//     const videoId = req.body.videoId;


//     User.updateOne(
//         { email: req.session.email },
//         { $pull: { history: videoId } },
//         (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).json({ error: 'Failed to update user history' });
//             }

//             User.updateOne(
//                 { email: req.session.email },
//                 { $push: { history: { $each: [videoId] } }, $set: { currentPlaying: videoId } },
//                 (err, result) => {
//                     if (err) {
//                         console.error(err);
//                         return res.status(500).json({ error: 'Failed to update user history' });
//                     }
//                     return res.status(200).json({ message: 'Song added to history successfully' });
//                 }
//             );
//         });
// });

rootRouter.post('/addPlaylistToHistory', (req, res) => {
    const playlist = req.body.playlist;

    User.updateOne(
        { email: req.session.email },
        { $set: { currentPlaylist: playlist } }
    )
})

rootRouter.post('/addSongToHistory', (req, res) => {
    const videoId = req.body.videoId;
    const maxHistoryLength = 10;

    User.updateOne(
        { email: req.session.email },
        { $pull: { history: videoId } },
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update user history' });
            }

            User.updateOne(
                { email: req.session.email },
                {
                    $push: {
                        history: {
                            $each: [videoId],
                            $slice: -maxHistoryLength
                        }
                    },
                    $set: { currentPlaying: videoId }
                },
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Failed to update user history' });
                    }
                    return res.status(200).json({ message: 'Song added to history successfully' });
                }
            );
        });
});


rootRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        req.session.loggedIn = true;
        req.session.email = email
        req.session.username = user.username;
        res.redirect('/');

    } catch (error) {
        res.status(500).json({ error: 'Failed to sign in' });
    }

})

rootRouter.get('/user', async (req, res) => {
    const user = await User.findOne({ email: req.session.email })
    try {
        return res.send(user)
    } catch (error) {
        res.status(500).json({ error: 'failed' })
    }
})


rootRouter.post('/logout', (req, res) => {
    req.session.destroy();

    res.sendStatus(200);
});



// rootRouter.get('/getLoginStatus', (req, res) => {
//     const loginStatus = {
//         loggedIn: req.session.loggedIn
//     };
//     res.json(loginStatus);
// });


rootRouter.get('/update', async (req, res) => {
    // update thumbnail
    // try {
    //     const works = await Work.find({ videoId: { $exists: true } });

    //     for (let i = 0; i < works.length; i++) {
    //         const apiKey = process.env.API_KEY;
    //         const videoId = works[i].videoId;
    //         const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;

    //         const response = await fetch(url);
    //         const data = await response.json();
    //         const thumbnails = data.items[0].snippet.thumbnails;
    //         let thumbnailUrl;

    //         if (thumbnails.maxres) {
    //             thumbnailUrl = thumbnails.maxres.url;
    //         } else if (thumbnails.high) {
    //             thumbnailUrl = thumbnails.high.url;
    //         } else {
    //             // 기본 크기의 썸네일을 사용하거나 다른 처리를 수행합니다.
    //             thumbnailUrl = thumbnails.default.url;
    //         }

    //         // const thumbnailUrl = data.items[0].snippet.thumbnails.default.url;

    //         works[i].thumbnail = thumbnailUrl;
    //         await works[i].save();

    //         console.log(`Thumbnail URL for videoId ${videoId} has been updated.`);
    //     }


    //     res.send("Thumbnail update completed");
    // } catch (error) {
    //     console.error('An error occurred during thumbnail update:', error);
    //     res.status(500).send('Thumbnail update failed.');
    // }

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



export default rootRouter

import express from "express";
import { home } from "../controllers/songController";
import { library } from "../controllers/songController";
import { search } from "../controllers/songController";
import { playlist } from "../controllers/songController";
import { profile } from "../controllers/songController";
import { register } from "../controllers/songController";
import User from "../models/User";
import Work from "../models/Work";
import Playlist from "../models/Playlist";
import bcrypt from 'bcrypt';



const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/", (req, res) => {
    res.cookie('cookieName', 'cookieValue', { sameSite: 'None', secure: true });
})
rootRouter.get("/search", search);
rootRouter.get("/library", library);
rootRouter.get("/profile", profile);
rootRouter.get("/register", register);
rootRouter.get('/playlist/:id', playlist);

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


rootRouter.post('/createPlaylist', async (req, res) => {
    const { name, currentVideoId } = req.body;
    try {
        if (currentVideoId == "none") {
            let newPlaylist = new Playlist({ name, userId: req.session.email, username: req.session.username })

            await newPlaylist.save();
        } else {
            const work = await Work.findOne({ videoId: currentVideoId })
            let newPlaylist = new Playlist({ name, playlist: [currentVideoId], userId: req.session.email, thumbnails: [work.thumbnail], username: req.session.username });

            await newPlaylist.save();
        }
        res.status(200).json({ message: 'Playlist created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'failed to create a playlist' })
    }
})

rootRouter.post("/deleteFromPlaylist", async (req, res) => {
    const { playlistId, videoId } = req.body;
    try {
        if (playlistId != "like") {
            await Playlist.updateOne(
                { _id: playlistId },
                {
                    $pull: {
                        playlist: videoId,
                        thumbnails: { $regex: videoId }
                    }
                }
            );
        } else {
            await User.updateOne(
                { email: req.session.email },
                { $pull: { liked: videoId } }
            )
        }

        res.status(200).json({ message: 'Song deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete song from playlist' });

    }
})


rootRouter.post("/addToPlaylist", async (req, res) => {
    const { playlistId, currentVideoId } = req.body;

    try {
        const playlist = await Playlist.findById(playlistId);
        const work = await Work.findOne({ videoId: currentVideoId })

        if (playlist.playlist.includes(currentVideoId)) {
            return res.status(400).json({ error: 'Song already exists in the playlist' });
        }

        await Playlist.updateOne(
            { _id: playlistId },
            { $push: { playlist: currentVideoId, thumbnails: work.thumbnail } }
        );

        res.status(200).json({ message: 'Song added to playlist successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add song to playlist' });

    }
});


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

rootRouter.post('/like', (req, res) => {
    const { videoId } = req.body;

    User.findOne({ email: req.session.email }, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to find user' });
        }

        const likedArray = user.liked;

        if (likedArray.includes(videoId)) {
            User.updateOne(
                { email: req.session.email },
                {
                    $pull: { liked: videoId }
                },
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Failed to update user history' });
                    }
                    return res.status(200).json({ message: 'Song added to history successfully' });
                }
            );

        } else {
            User.updateOne(
                { email: req.session.email },
                {
                    $addToSet: { liked: videoId }
                },
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Failed to update user history' });
                    }
                    return res.status(200).json({ message: 'Song added to history successfully' });
                }
            );
        }

        user.save((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update user playlist' });
            }

            res.end();
        });
    });
})

rootRouter.post('/checkLiked', async (req, res) => {
    const { currentVideoId } = req.body;

    try {
        const user = await User.findOne(
            { email: req.session.email }
        );

        if (user && user.liked.includes(currentVideoId)) {
            res.json({ isLiked: true });
        } else {
            res.json({ isLiked: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'server error' });
    }
})

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
import { Billingconductor } from "aws-sdk";
import Work from "../models/Work";
import User from "../models/User";
import Composer from "../models/Composer";
import Playlist from "../models/Playlist";

export const home = async (req, res) => {
  const sortByViewPromise = await Work.find({ videoId: { $exists: true } }).sort({ view: -1 }).exec();
  const sortByDatePromise = await Work.find({ videoId: { $exists: true } }).sort({ date: -1 }).exec();
  const sortByPlaylistPromise = await Playlist.find().exec();

  const user = await User.findOne({ email: req.session.email })
  let playlists = []

  let history = []
  let loggedIn = false;

  if (user) {
    loggedIn = true;

    for (let i = 0; i < user.history.length; i++) {
      const music = await Work.findOne({ videoId: `${user.history[i]}` }).exec();

      if (music) {
        const { composer, title, performer, thumbnail, videoId } = music;
        const info = { composer, title, performer, thumbnail, videoId };
        history.push(info);
      }
    }
  }

  const currentHour = new Date().getHours();
  let timeRecommend = "";

  if (4 < currentHour && currentHour < 12) {
    timeRecommend = "morning"
  } else if (currentHour < 18) {
    timeRecommend = "afternoon"
  } else if (currentHour <= 23) {
    timeRecommend = "evening"
  } else {
    timeRecommend = "night";
  }

  const sortByTimePromise = Work.find({ videoId: { $exists: true }, character: timeRecommend }).exec();

  const userPlaylistPromise = await Playlist.find({ userId: req.session.email }).exec();
  const userPlaylistResult = await Promise.all(userPlaylistPromise)

  try {
    const [sortByViewResult, sortByDateResult, sortByTimeResult, sortByPlaylistResult] = await Promise.all([sortByViewPromise, sortByDatePromise, sortByTimePromise, sortByPlaylistPromise]);


    return res.render("home", {
      pageTitle: "Home",
      rank: sortByViewResult,
      recent: sortByDateResult,
      recommend: sortByTimeResult,
      time: timeRecommend,
      recommendLength: sortByTimeResult.length,
      history: history,
      user: user,
      recommendPlaylist: sortByPlaylistResult,
      playlist: playlists,
      loggedIn: loggedIn,
      list: userPlaylistResult,
    });
  } catch (err) {
    console.log(err);
  }
};


export const search = async (req, res) => {
  let query = req.query.keyword
  let composer = ""
  let playlists = []
  let loggedIn = false;

  const user = await User.findOne({ email: req.session.email })
  if (user) {
    loggedIn = true;
  }
  const userPlaylistPromise = await Playlist.find({ userId: req.session.email }).exec();
  const userPlaylistResult = await Promise.all(userPlaylistPromise)





  try {
    if (query !== undefined) {
      if (query === "Frédéric Chopin" || query === "Franz Schubert" || query === "Robert Schumann" || query === "Franz Liszt" || query === "Pyotr Ilyich Tchaikovsky" || query === "Felix Mendelssohn" || query === "Johannes Brahms" || query === "Sergei Rachmaninov") {
        composer = query;
        const words = query.split(" ");
        query = words[words.length - 1];
      }


      let sortBySearchPromise = await Work.find({ videoId: { $exists: true }, title: new RegExp(query, "i") }).exec();

      if (query === "Early Romantic" || query === "Middle Romantic" || query === "Late Romantic" || query === "Post Romantic") {
        const words = query.split(" ");
        const era = words[0].toLowerCase();
        const sortByEraPromise = await Work.find({ videoId: { $exists: true }, era: era }).exec();
        sortBySearchPromise = sortByEraPromise
        composer = query;
      }

      let sortByComposerPromise = await Composer.findOne({ name: composer }).exec();
      let [sortBySearchResult, composerResult] = await Promise.all([sortBySearchPromise, sortByComposerPromise])


      return res.render("search", {
        pageTitle: "Search",
        keyword: req.query.keyword,
        results: sortBySearchResult,
        composer: composer,
        info: composerResult,
        playlist: playlists,
        loggedIn: loggedIn,
        list: userPlaylistResult
      });

    } else {
      return res.render("Search", {
        pageTitle: "Search",
        playlist: playlists,
        loggedIn: loggedIn,
        list: userPlaylistResult
      })

    }
  } catch (err) {
    console.log(err);
  }
};

export const library = async (req, res) => {
  let playlists = [];
  let loggedIn = false;

  const user = await User.findOne({ email: req.session.email })
  if (user) {
    loggedIn = true;
  }

  try {
    const sortByPlaylistPromise = await Playlist.find({ userId: req.session.email }).exec();
    const sortByPlaylistResult = await Promise.all(sortByPlaylistPromise)


    return res.render("library", {
      pageTitle: "Library",
      playlist: playlists,
      userPlaylist: sortByPlaylistResult,
      list: sortByPlaylistResult,
      loggedIn: loggedIn
    });
  } catch (err) {
    console.log(err);
  }

};

export const playlist = async (req, res) => {
  try {
    const playlistId = req.params.id;
    let playlists = []
    let loggedIn = false;
    const user = await User.findOne({ email: req.session.email })
    if (user) {
      loggedIn = true;
    }
    const userPlaylistPromise = await Playlist.find({ userId: req.session.email }).exec();
    const userPlaylistResult = await Promise.all(userPlaylistPromise)



    if (playlistId == "liked") {

      let likedList = []

      const playlistInfo = { _id: "like", name: "Your likes", userId: req.session.email }

      if (user) {
        for (let i = 0; i < user.liked.length; i++) {
          const music = await Work.findOne({ videoId: `${user.liked[i]}` }).exec();

          if (music) {
            const { composer, title, performer, thumbnail, videoId } = music;
            const info = { composer, title, performer, thumbnail, videoId };
            likedList.push(info);
          }
        }
      }


      return res.render("playlist", {
        pageTitle: "Playlist",
        likedList: likedList,
        playlistInfo: playlistInfo,
        playlist: playlists,
        loggedIn: loggedIn,
        list: userPlaylistResult,
        user: user,
      });
    } else {

      let likedList = []

      const userPlaylist = await Playlist.findOne({ _id: playlistId }).exec();

      for (let i = 0; i < userPlaylist.playlist.length; i++) {
        const music = await Work.findOne({ videoId: `${userPlaylist.playlist[i]}` }).exec();

        if (music) {
          const { composer, title, performer, thumbnail, videoId } = music;
          const info = { composer, title, performer, thumbnail, videoId };
          likedList.push(info);
        }
      }

      let user = await User.findOne({ email: req.session.email })

      if (!user) {
        user = ""
      }


      return res.render("playlist", {
        pageTitle: "Playlist",
        playlistInfo: userPlaylist,
        likedList: likedList,
        playlist: playlists,
        loggedIn: loggedIn,
        list: userPlaylistResult,
        user: user,
      })

    }

  } catch (err) {
    console.log(err);
  }
};

export const profile = async (req, res) => {
  let playlists = []
  try {
    const user = await User.findOne({ email: req.session.email })
    const userPlaylistPromise = await Playlist.find({ userId: req.session.email }).exec();
    const userPlaylistResult = await Promise.all(userPlaylistPromise)


    let loggedIn = false;
    if (user) {
      loggedIn = true;
    }


    return res.render("profile", {
      pageTitle: "Profile",
      playlist: playlists,
      loggedIn: loggedIn,
      list: userPlaylistResult
    });
  } catch (err) {
    console.log(err);
  }
};

export const player = async (req, res) => {
  const playerData = {

  };

  return res.json(playerData);
}

export const register = async (req, res) => {
  let playlists = []
  try {
    const user = await User.findOne({ email: req.session.email })
    const userPlaylistPromise = await Playlist.find({ userId: req.session.email }).exec();
    const userPlaylistResult = await Promise.all(userPlaylistPromise)


    let loggedIn = false;
    if (user) {
      loggedIn = true;
    }


    return res.render("register", {
      pageTitle: "Register",
      playlist: playlists,
      loggedIn: loggedIn,
      list: userPlaylistResult
    });
  } catch (err) {
    console.log(err);
  }
};


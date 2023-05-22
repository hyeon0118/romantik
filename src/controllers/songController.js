import { Billingconductor } from "aws-sdk";
import Work from "../models/Work";
import User from "../models/User";
import Composer from "../models/Composer";

export const home = async (req, res) => {
  const sortByViewPromise = await Work.find({ videoId: { $exists: true } }).sort({ view: -1 }).exec();
  const sortByDatePromise = await Work.find({ videoId: { $exists: true } }).sort({ date: -1 }).exec();
  const user = await User.findOne({ email: req.session.email })
  let playlists = []

  let history = []
  let loggedIn = false;

  if (user) {
    loggedIn = true;
    playlists = Object.keys(user.playlist);

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

  try {
    const [sortByViewResult, sortByDateResult, sortByTimeResult] = await Promise.all([sortByViewPromise, sortByDatePromise, sortByTimePromise]);

    return res.render("home", {
      pageTitle: "Home",
      rank: sortByViewResult,
      recent: sortByDateResult,
      recommend: sortByTimeResult,
      time: timeRecommend,
      recommendLength: sortByTimeResult.length,
      history: history,
      user: user,
      playlist: playlists,
      loggedIn: loggedIn
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


  try {
    const user = await User.findOne({ email: req.session.email })
    if (user) {
      loggedIn = true;
      playlists = Object.keys(user.playlist);

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
          loggedIn: loggedIn
        });

      }
    } else {
      return res.render("Search", {
        pageTitle: "Search",
        playlist: playlists,
        loggedIn: loggedIn
      })

    }
  } catch (err) {
    console.log(err);
  }
};

export const library = async (req, res) => {
  let playlists = [];
  let loggedIn = false;

  try {
    const user = await User.findOne({ email: req.session.email })
    if (user) {
      loggedIn = true;
      playlists = Object.keys(user.playlist);

      return res.render("library", {
        pageTitle: "Library",
        playlist: playlists,
        loggedIn: loggedIn
      });
    }
  } catch (err) {
    console.log(err);
  }

};

export const playlist = async (req, res) => {
  try {
    const playlistId = req.params.id;
    let playlists = []
    let loggedIn = false;

    if (playlistId == "liked") {
      const user = await User.findOne({ email: req.session.email })
      playlists = Object.keys(user.playlist);

      let likedList = []

      if (user) {
        loggedIn = true;
        for (let i = 0; i < user.playlist.liked.length; i++) {
          const music = await Work.findOne({ videoId: `${user.playlist.liked[i]}` }).exec();

          if (music) {
            const { composer, title, performer, thumbnail, videoId } = music;
            const info = { composer, title, performer, thumbnail, videoId };
            likedList.push(info);
          }
        }
      }


      return res.render("playlist", {
        pageTitle: "Playlist",
        like: likedList,
        playlist: playlists,
        loggedIn: loggedIn
      });
    } else {

    }

  } catch (err) {
    console.log(err);
  }
};

export const profile = async (req, res) => {
  let playlists = []
  try {
    const user = await User.findOne({ email: req.session.email })
    playlists = Object.keys(user.playlist);

    let loggedIn = false;
    if (user) {
      loggedIn = true;
    }


    return res.render("profile", {
      pageTitle: "Profile",
      playlist: playlists,
      loggedIn: loggedIn
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
  return res.render("register", { pageTitle: "Register" });
}

const composers = ['Frédéric Chopin', 'Robert Schumann', 'Clara Schumann', 'Franz Liszt', 'Pyotr Ilyich Tchaikovsky', 'Felix Mendelssohn', 'Johannes Brahms', 'Sergei Rachmaninov']


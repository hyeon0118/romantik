import { Billingconductor } from "aws-sdk";
import Work from "../models/Work";
import User from "../models/User";
import searchResult from "../routers/rootRouter";

export const home = async (req, res) => {
  const sortByViewPromise = await Work.find({ videoId: { $exists: true } }).sort({ view: -1 }).exec();
  const sortByDatePromise = await Work.find({ videoId: { $exists: true } }).sort({ date: -1 }).exec();
  const user = await User.findOne({ email: req.session.email })
  const username = user.username
  let history = []

  for (let i = 0; i < user.history.length; i++) {
    const music = await Work.findOne({ videoId: `${user.history[i]}` }).exec();

    if (music) {
      const { composer, title, performer, thumbnail } = music;
      const info = { composer, title, performer, thumbnail };
      history.push(info);
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
    });
  } catch (err) {
    console.log(err);
  }
};

export const search = async (req, res) => {

  const query = req.query.keyword

  try {
    if (query !== undefined) {
      const sortBySearchPromise = await Work.find({ videoId: { $exists: true }, title: new RegExp(query, "i") }).exec();
      const earlyRomanticPromise = await Work.find({ videoId: { $exists: true }, era: "early" }).exec();
      const middleRomanticPromise = await Work.find({ videoId: { $exists: true }, era: "middle" }).exec();
      const lateRomanticPromise = await Work.find({ videoId: { $exists: true }, era: "late" }).exec();
      const postRomanticPromise = await Work.find({ videoId: { $exists: true }, era: "post" }).exec();
      const [sortBySearchResult, earlyRomanticResult, middleRomanticResult, lateRomanticResult, postRomanticResult] = await Promise.all([sortBySearchPromise, earlyRomanticPromise, middleRomanticPromise, lateRomanticPromise, postRomanticPromise])

      return res.render("search", {
        pageTitle: "Search",
        keyword: query,
        results: sortBySearchResult,
        early: earlyRomanticResult,
        middle: middleRomanticResult,
        late: lateRomanticResult,
        post: postRomanticResult,
      });
    } else {
      return res.render("Search", {
        pageTitle: "Search",
      })

    }



  } catch (err) {
    console.log(err);
  }

};

export const library = async (req, res) => {
  return res.render("library", { pageTitle: "Library" });
};

export const playlist = async (req, res) => {
  return res.render("playlist", { pageTitle: "Playlist" });
};

export const profile = async (req, res) => {
  return res.render("profile", { pageTitle: "Profile" });
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


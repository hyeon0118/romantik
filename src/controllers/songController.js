import { Billingconductor } from "aws-sdk";
import Work from "../models/Work";
import User from "../models/User";
import searchResult from "../routers/rootRouter";


export const home = async (req, res) => {
  const sortByViewPromise = Work.find({ videoId: { $exists: true } }).sort({ view: -1 }).exec();
  const sortByDatePromise = Work.find({ videoId: { $exists: true } }).sort({ date: -1 }).exec();
  const currentHour = new Date().getHours();
  let timeRecommend = "";

  if (4 < currentHour < 12) {
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
      recommendLength: sortByTimeResult.length
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
      const [sortBySearchResult] = await Promise.all([sortBySearchPromise])
      return res.render("search", {
        pageTitle: "Search",
        results: sortBySearchResult,
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



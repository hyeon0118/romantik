import { Billingconductor } from "aws-sdk";
import Work from "../models/Work";
import User from "../models/User";


export const home = async (req, res) => {
  const sortByViewPromise = Work.find({ videoId: { $exists: true } }).sort({ view: -1 }).exec();
  const sortByDatePromise = Work.find({ videoId: { $exists: true } }).sort({ date: -1 }).exec();

  try {
    const [sortByViewResult, sortByDateResult] = await Promise.all([sortByViewPromise, sortByDatePromise]);

    return res.render("home", {
      pageTitle: "Home",
      rank: sortByViewResult,
      recent: sortByDateResult,
    });
  } catch (err) {
    console.log(err);
  }
};

export const search = async (req, res) => {
  return res.render("search", { pageTitle: "Search" });
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


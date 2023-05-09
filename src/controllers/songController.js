import { Billingconductor } from "aws-sdk";
import Work from "../models/Work";
import User from "../models/User";


export const home = async (req, res) => {
  Work.find({ videoId: { $exists: true } })
    .sort({ view: -1 })
    .then((result) => {
      return res.render("home", {
        pageTitle: "Home",
        works: result
      });
    })
    .catch((err) => {
      console.log(err);
    })
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


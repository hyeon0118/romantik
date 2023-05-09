import { Billingconductor } from "aws-sdk";
import Work from "../models/Work";
import User from "../models/User";


const axios = require('axios'); // new 
const API_KEY = process.env.API_KEY;
const titleList = []




export const home = async (req, res) => {
  Work.find()
    .then((result) => {
      for (let i = 0; i < result.length; i++) {
        titleList.push(result[i].title)
      }

      return res.render("home", {
        pageTitle: "Home",
        works: titleList
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


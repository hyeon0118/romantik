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


// songController.js

const EventEmitter = require('events');

// 이벤트를 생성할 객체 생성
const eventEmitter = new EventEmitter();

// 이벤트 핸들러 등록
eventEmitter.on('customEvent', (data) => {
  console.log('이벤트 발생:', data);
});

// 이벤트 발생
eventEmitter.emit('customEvent', 'Hello, Node.js!');

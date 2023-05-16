import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";

const app = express();
const logger = morgan("dev");


app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.get('/getLoginStatus', (req, res) => {
  const loginStatus = {
    loggedIn: req.session.loggedIn
  };
  res.json(loginStatus);
});

app.get("views/partials/home.pug", function (req, res) {
  res.render("player");
})

app.use("/", rootRouter);
app.use(function (req, res, next) {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

  const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  if (isSecure) {
    res.setHeader('Set-Cookie', 'cookieName=value; Secure; SameSite=None');
  } else {
    res.setHeader('Set-Cookie', 'cookieName=value; SameSite=Lax');
  }

  next();
});


/*
Add more routers here!
*/


export default app;

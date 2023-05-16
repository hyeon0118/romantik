export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Romantik";
  res.locals.loggedInEmail = req.session.email || {};
  res.locals.loggedInUsername = req.session.username || {};
  next();
};

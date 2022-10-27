const withAuth = (req, res, next) => {
  if(!req.session.loggedIn) {
    res.redirect('/login')
  } else {
    next(); // this says just continue down the logic
  }
};

module.exports = withAuth;

const withAuth = (req, res, next) => {
<<<<<<< HEAD
  if(!req.session.loggedIn) {
    res.redirect('/login')
  } else {
    next(); // this says just continue down the logic
=======
  // If the user isn't logged in, redirect them to the login route
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    next();
>>>>>>> main
  }
};

module.exports = withAuth;

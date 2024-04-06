const express = require('express');
var router = express.Router();
const UsersModel = require('../models/members'); 

router.get("/", async function(req, res) {
  req.TPL.login_error = req.session.login_error;
  req.session.login_error = "";

  // render the login page
  res.render("login", req.TPL);
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.log('Error destroying session:', err);
      }
      res.redirect('/login');
  });
});

router.post("/attemptlogin", async function(req, res) {
  try {
    const user = await UsersModel.checkCredentials(req.body.username);
    // Check if user is found and the password matches
    if (req.body.password === user.password) {
      // If password matches, save user details in session
      req.session.user_id = user.user_id;
      req.session.username = req.body.username; 
      res.redirect("/bookings");
    } else {
      req.session.login_error = "Invalid username and/or password!";
      res.redirect("/login");
    }
  } catch (error) {
    console.error('Error during login attempt:', error);
    req.session.login_error = "An error occurred during login.";
    res.redirect("/login");
  }
});

module.exports = router;
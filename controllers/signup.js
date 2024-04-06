const express = require('express');
var router = express.Router()
const MembersModel = require('../models/members.js')

// Displays the signup page
router.get("/", async function(req, res)
{
  req.TPL.signup_error = req.session.signup_error;
  req.TPL.signup_success = req.session.signup_success;
  req.session.signup_error = "";
  req.session.signup_success = false;

  // render the login page
  res.render("signup", req.TPL);
});

router.post("/attemptsignup", async function(req, res) {
    const { username, password, age } = req.body;

    if (username && password) {
        const numericAge = parseInt(age, 10);
        if (numericAge < 18) {
            req.session.signup_error = "You must be over 18 to sign up.";
            return res.redirect("/signup");
        }

        try {
            await MembersModel.createCredentials(username, password, numericAge);

            // Setting signup success message
            req.session.signup_success = true;
            res.redirect("/signup");  // Assuming you show the message on the signup page or redirect appropriately
        } catch (err) {
            console.error(err);
            req.session.signup_error = "An error occurred during signup!";
            res.redirect("/signup");
        }
    } else {
        req.session.signup_error = "Username and password cannot be blank!";
        res.redirect("/signup");
    }
});

module.exports = router;
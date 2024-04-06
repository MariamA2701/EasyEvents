const express = require('express');
const router = express.Router();
const { TrackEventCommand, EventTracker } = require('../models/bookings.js'); 

router.get("/", async function(req, res) {
    console.log("Accessing /bookings route");
    req.TPL.login_error = req.session.login_error || '';
    req.TPL.booking_error = req.session.booking_error || '';
    req.session.login_error = "";  
    req.session.booking_error = "";  
    res.render("bookings", req.TPL);
});


// Handle booking attempt
router.post("/attemptbookings", async (req, res) => {
    const { location, attendees, date } = req.body; 
    const user_id = req.session.user_id;
    const eventData = { user_id, event_date: date, location, attendees };

    const eventTracker = new EventTracker();
    const command = new TrackEventCommand(eventData);
    eventTracker.setCommand(command);

    try {
        await eventTracker.trackEvent();
        res.redirect('/history'); 
    } catch (error) {
        console.error('Booking error:', error);
        req.session.booking_error = 'Error booking the event.';
        res.redirect('/bookings'); 
    }
});



module.exports = router;
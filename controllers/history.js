const express = require('express');
const router = express.Router();
const { EventModel } = require('../models/bookings.js');


router.post('/deleteEvent/:event_id', async (req, res) => {
    console.log('Delete event route hit', req.params.event_id);
    const eventId = req.params.event_id;

    const newEvent  = new EventModel()
    console.log("EventModel", newEvent.deleteEvent);


    try {
        await newEvent.deleteEvent(eventId);
        // Redirect or render a view after deletion 
        res.render('deleteEventConfirmation');
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send('Error processing your request');
    }
});


router.get('/', async (req, res) => {
    // Check if the user is logged in
    if (!req.session.user_id) {
        // Not logged in, redirect to login page or show an error
        res.redirect('/login');
        return; // Stop further execution in this callback
    }

    const user_id = req.session.user_id;
    try {
        const events = await EventModel.getEventsByUserId(user_id);
        if (events) {
            console.log(events);
            res.render('history', { events: events });
        } else {
            // Handle the case where no events are found
            res.render('history', { events: [] });
        }
    } catch (error) {
        console.error('Error retrieving events:', error);
        res.status(500).send('Error retrieving events');
    }
});

module.exports = router;
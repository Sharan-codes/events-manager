const Event = require('../models/event');
require('../constants');
const {Like} = require('../models/like');
const {Comment} = require('../models/comment');
const express = require('express');
const router = new express.Router();

router.post('/addEvent', async (req, res) => {
  try {
    /*
    //search fo the event by name and status as active
    let event = await Event.findOne({ 
			eventName: req.body.eventName,
			status: EVENT_ACTIVE
		});

    if (event) {
      return res.status(400).send("Event exists");
    }
    */

    //count of total no. of events
    const idCount = await Event.countDocuments({});
    
    let event = new Event(req.body);
    if(event === undefined) {
      return res.status(400).send("Event details required");
    }

    //initialise eventId
    event.eventId = idCount + 1,

    //initialise no. of available tickets by the total no. of tickets
    event.availableTickets = event.totalTickets;
    await event.save();
    return res.status(201).send({ message: event.eventName+" added", redirect: '/adminViewEvents' });
    // return res.redirect('register_success.html'); 
  }
  catch (e) {
    res.status(400).send(e);
  }
});

router.get('/adminAddEvent', (req, res) => {
  //Return to login page on back button press if already logged out
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (!req.session.user ) {
    return res.redirect('login.html');
  } 
  return res.render('pages/addEvent');
});

//To view the list of events
router.get('/adminViewEvents', async (req, res) => {
	try {
    //Return to login page on back button press if already logged out
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if (!req.session.user ) {
      return res.redirect('login.html');
    }

    const events = await Event.find({});
    res.render('pages/adminViewEvents', { title: 'Events', records:events });
		// res.send(events);
	} catch (e) {
		res.status(500).send();
	}
});

//To view the details of an event
router.get('/adminEventDetails', async (req, res) => {
	try {
    //Return to login page on back button press if already logged out
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if (!req.session.user ) {
      return res.redirect('login.html');
    }

    const event = await Event.findOne({eventId : req.query.eventId, eventName : req.query.eventName});
    if (!event) {
      return res.status(404).send("Event not found");
    }

    //count the total no. of likes for the event
    const totalLikes = await Like.countDocuments({
      eventId : req.query.eventId,
      eventName : req.query.eventName,
      liked : TRUE
    });

    //retrieve all the comments with user name for the event
    const comments = await Comment.find({
      eventId : req.query.eventId,
      eventName : req.query.eventName
    });
    
    res.render('pages/adminEventDetails', { title: 'Event details', event : event, totalLikes : totalLikes, records: comments });
		// res.send(events);
	} catch (e) {
		res.status(500).send();
	}
});

//To update the status of an event as INACTIVE
router.post('/removeEvent', async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate({
      eventId : req.query.eventId,
      eventName : req.query.eventName,
       status : EVENT_ACTIVE
    }, { status: EVENT_INACTIVE });
    if (!event) {
      console.log("Event not found");
      return res.status(404).send("Event not found");
    }
   
    console.log("removed event :");
    console.log(event);

    return res.status(200).send("Event removed");
			
  }
  catch (e) {
    res.status(500).send();
  }
});

module.exports = router;

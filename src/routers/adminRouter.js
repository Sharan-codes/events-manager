const Event = require('../models/event');
require('../constants');
const {Like} = require('../models/like');
const {Comment} = require('../models/comment');
const express = require('express');
const router = new express.Router();

router.post('/addEvent', async (req, res) => {
  try {
    //search fo the event by name and status as active
    let event = await Event.findOne({ 
			eventName: req.body.eventName,
			status: EVENT_ACTIVE
		});

    if (event) {
      return res.status(400).send("Event exists");
    }

    event = new Event(req.body);
    if(event === undefined) {
      return res.status(400).send("Event details required");
    }
    //initialise no. of available tickets by the total no. of tickets
    event.availableTickets = event.totalTickets;
    await event.save();
    res.status(201).send(event.eventName+" added");
    // return res.redirect('register_success.html'); 
  }
  catch (e) {
    res.status(400).send(e);
  }
});
//To view the list of events
router.get('/adminViewEvents', async (req, res) => {
	try {
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
    const event = await Event.findOne({eventName : req.query.eventName});
    if (!event) {
      return res.status(404).send("Event not found");
    }

    //count the total no. of likes for the event
    const totalLikes = await Like.countDocuments({
      eventName : req.query.eventName,
      liked : TRUE
    });

    //retrieve all the comments with user name for the event
    const comments = await Comment.find({
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
      eventName : req.query.eventName,
       status : EVENT_ACTIVE
    }, { status: EVENT_INACTIVE });
    if (!event) {
      res.redirect('/adminViewEvents');
      console.log("Event not found");
      return res.status(404).send("Event not found");
    }
   
    console.log("removed event :");
    console.log(event);

    res.redirect('/adminViewEvents');
			
  }
  catch (e) {
    res.status(500).send();
  }
});

module.exports = router;

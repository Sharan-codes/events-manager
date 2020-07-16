const Event = require('../models/event');
require('../constants');
const express = require('express');
const router = new express.Router();

router.post('/addEvent', async (req, res) => {
  try {
    let event = await Event.findOne({ 
			eventName: req.body.eventName,
			status: EVENT_ACTIVE
		});

    if (event) {
      return res.status(400).send("Event exists");
    }

    event = new Event(req.body);
    if(event===undefined) {
      return res.status(400).send("Event details required");
    }
    event.availableTickets=event.totalTickets;
    await event.save();
    res.status(201).send(event.eventName+" added");
    // return res.redirect('register_success.html'); 
    }
    catch (e) {
      res.status(400).send(e);
    }
});

router.get('/adminViewEvents', async (req, res) => {
	try {
      const events = await Event.find({});
      res.render('pages/adminviewevents', { title: 'Events', records:events });
			// res.send(events);
	} catch (e) {
			res.status(500).send();
	}
});

router.get('/adminEventDetails', async (req, res) => {
	try {
    const event = await Event.findOne({eventName : req.query.eventName});
    if (!event) {
      return res.status(404).send("Event not found");
    }
    res.render('pages/admineventdetails', { title: 'Event details', event : event });
		// res.send(events);
	} catch (e) {
		res.status(500).send();
	}
});

router.get('/engine', function(req, res) {
  res.render('pages/index');
});

router.post('/removeEvent', async (req, res) => {
  try {
    const events = await Event.find({});
    const event = await Event.findOneAndUpdate({
      eventName : req.query.eventName,
       status : 1
      }, { status: 0 });
    if (!event) {
      res.render('pages/adminviewevents', { title: 'Events', records:events });
      console.log("Event not found");
      return res.status(404).send("Event not found");
    }
   
    console.log("removed event :");
    console.log(event);

    res.render('pages/adminviewevents', { title: 'Events', records:events });
			
  }
  catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
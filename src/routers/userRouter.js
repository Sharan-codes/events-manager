const Event = require('../models/event');
const {User} = require('../models/user');
const {Like} = require('../models/like');
const {Comment} = require('../models/comment');
const express = require('express');
const router = new express.Router();

//To login as admin or user or register an user
router.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({ name: req.body.name });

    //if user name is present check the password
    if (user) {
      if (user.password !== req.body.password) {
      	return res.status(400).send("invalid password");
      }
      req.session.user = user;
      console.log(req.session.user);
      
      if (user.name === "admin") {
        return res.status(200).send({ redirect: 'addEvent.html' });
        // return res.redirect('addEvent.html');
      } 
      else {
        return res.status(200).send({ redirect: '/userViewEvents' });
        //return res.redirect('/userViewEvents');
      }
    } 
    else {
      return res.status(400).send("user not found");
    }
  }
  catch (e) {
    res.status(400).send(e);
  }
});

router.post('/register', async (req, res) => {
  try {
    let user = await User.findOne({ name: req.body.name });

    //if user name is present don't register
    if (user) {
        console.log("changename");
      	return res.status(400).send("changename");
      }

    //for a new user name, register the user
    user = new User(req.body);
    
    await user.save();
    return res.status(201).send(user.name+" registered");
    //return res.redirect('register_success.html'); 
  }
  catch (e) {
    res.status(400).send(e);
  }
});

//To logout from the session
router.get('/logout', function(req, res) {
  let user = req.session.user.name;
  req.session.destroy(function(err){  
    if(err) {  
      console.log(err); 
      res.status(400).send(e);
    }  
    else {  
      console.log(user + ' logged out successfully!'); 
      return res.redirect('login.html');
    }  
  });
});
//To redirect if already logged in
router.get('/', (req, res) => {
  if(req.session.user){  
    console.log(req.session.user); 

    if (req.session.user.name === "admin") {
      return res.redirect('addEvent.html');
    } 

    return res.redirect('/userViewEvents');
  } 
  return res.redirect('login.html');
});

router.get('/page', (req, res) => {
  if(req.session.user){  
    console.log(req.session.user); 
    return res.redirect('page.html');
  } 
  return res.redirect('login.html');
});

//To view the list of events
router.get('/userViewEvents', async (req, res) => {
	try {
    const dateTimeNow = new Date();
    console.log(dateTimeNow)

    //search for the events with bookings still open
    const events = await Event.find({
      bookStartTime: { $lte : dateTimeNow},
      bookEndTime: { $gte : dateTimeNow},
      status: EVENT_ACTIVE
    });
    res.render('pages/userViewEvents', { title: 'Events', records: events, user: req.session.user.name });
		// res.send(events);
	} catch (e) {
		res.status(500).send();
	}
});

//To get the details of each event
router.get('/userEventDetails', async (req, res) => {
	try {
    const event = await Event.findOne({eventName : req.query.eventName});
    if (!event) {
      return res.status(404).send("Event not found");
    }

    //to check if the user has liked the event
    const user = req.session.user.name;
    let likeEvent = await Like.findOne({
        eventName : req.query.eventName,
        userName : user
    });

    let isLiked = FALSE;
    if (likeEvent) {
      isLiked = likeEvent.liked;
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
      
    res.render('pages/userEventDetails', { title: 'Event details', event : event, totalLikes : totalLikes, isLiked : isLiked, records: comments });
		// res.send(events);
	} catch (e) {
		res.status(500).send();
	}
});

//To book the tickets by the number
router.post('/buyTickets', async (req, res) => {
  try {
    const event = await Event.findOne({
      eventName : req.query.eventName,
      status : EVENT_ACTIVE
    });
    if (!event) {
      return res.status(404).send("Event not found");
    }
    if(req.body.numTickets > event.availableTickets) {
      return res.redirect('/userEventDetails?eventName=' + req.query.eventName);
    }
    else{

      //update the number of available tickets for the event after booking
      let remTickets = event.availableTickets - req.body.numTickets;
      const eventone = await Event.findOneAndUpdate({
        eventName : req.query.eventName,
        status : EVENT_ACTIVE
      }, { availableTickets: remTickets});

      if (!eventone) {
        return res.status(404).send("Event not found");
      }
    return res.redirect('/userEventDetails?eventName=' + eventone.eventName);
    }
  }
  catch (e) {
    res.status(500).send();
  }
});

//To update the like status for an event
router.post('/like', async (req, res) => {
  try {
    const user = req.session.user.name;

    let likeEvent = await Like.findOneAndUpdate({
        eventName : req.body.eventName,
        userName : user
      }, { liked: req.body.liked});

    if (!likeEvent) {
    let likeEvent = new Like({
      eventName: req.body.eventName,
      userName : user,
      liked: req.body.liked
    });
    
    await likeEvent.save(); 
  }
  // res.status(201).send(user.name+" registered");
  //console.log(likeEvent);
  res.send("Liked");
 // res.redirect('/userEventDetails?eventName=' + req.body.eventName); 
}
  catch (e) {
    res.status(400).send(e);
  }
});

//To add the user comment for an event
router.post('/comment', async (req, res) => {
  try {
    const user = req.session.user.name;
    let comment = new Comment({
      eventName: req.body.eventName,
      userName : user,
      comment: req.body.comment
    });
    
    await comment.save(); 
    return res.redirect('/userEventDetails?eventName=' + req.body.eventName); 
  }
  catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;

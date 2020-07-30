const Event = require('../models/event');
const {User} = require('../models/user');
const {Like} = require('../models/like');
const {Comment} = require('../models/comment');
const crypto = require('crypto');
const express = require('express');
const router = new express.Router();

//To login as admin or user or register an user
router.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({ name: req.body.name });

    //if user name is present check the password
    if (user) {

      //Hashing password with SHA-512
      //creating hash object 
      const hash = crypto.createHash('sha512');
      //passing the data to be hashed
      const data = hash.update(req.body.password, 'utf-8');
      //Creating the hash in the required format
      const genHash= data.digest('hex');

      if (user.password !== genHash) {
      	return res.status(400).send("invalid password");
      }
      req.session.user = user;
      console.log(req.session.user);
      
      if (user.type === ADMIN) {
        return res.status(200).send({ redirect: '/adminAddEvent' });
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

    //count of total no. of user
    const idCount = await User.countDocuments({});
    
    //Hashing password with SHA-512
    //creating hash object 
    const hash = crypto.createHash('sha512');
    //passing the data to be hashed
    const data = hash.update(req.body.password, 'utf-8');
    //Creating the hash in the required format
    const genHash= data.digest('hex');
    //Printing the output on the console
    console.log("hash : " + genHash);

    //for a new user name, register the user
    user = new User({
      type: USER,
      name: req.body.name,
      password: genHash
    });

    //initialise userId
    user.userId = idCount + 1;

    await user.save();
    return res.status(201).send(user.name+" registered with userId "+user.userId);
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

    if (req.session.user.type === ADMIN) {
      return res.redirect('/adminAddEvent');
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
    //Return to login page on back button press if already logged out
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if (!req.session.user) {
      return res.redirect('login.html');
    }

    const dateTimeNow = new Date();
    console.log(dateTimeNow);

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
    //Return to login page on back button press if already logged out
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if (!req.session.user ) {
      return res.redirect('login.html');
    }

    const event = await Event.findOne({eventId : req.query.eventId, eventName : req.query.eventName});
    if (!event) {
      return res.status(404).send("Event not found");
    }

    //to check if the user has liked the event
    const user = req.session.user;
    let likeEvent = await Like.findOne({
        eventId : req.query.eventId, 
        eventName : req.query.eventName,
        userId : user.userId, 
        userName : user.name
    });

    let isLiked = FALSE;
    if (likeEvent) {
      isLiked = likeEvent.liked;
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
      
    res.render('pages/userEventDetails', { title: 'Event details', event : event, user : user.name, totalLikes : totalLikes, isLiked : isLiked, records: comments });
		// res.send(events);
	} catch (e) {
		res.status(500).send();
	}
});

//To book the tickets by the number
router.post('/buyTickets', async (req, res) => {
  try {
    const event = await Event.findOne({
      eventId : req.query.eventId, 
      eventName : req.query.eventName,
      status : EVENT_ACTIVE
    });
    if (!event) {
      return res.status(404).send("Event not found");
    }

    if(req.body.numTickets > event.availableTickets) {
      return res.status(400).send({ availableTickets: event.availableTickets });
    }
    else{
      //update the number of available tickets for the event after booking
      let remTickets = event.availableTickets - req.body.numTickets;
      const eventone = await Event.findOneAndUpdate({
        eventId : req.query.eventId, 
        eventName : req.query.eventName,
        status : EVENT_ACTIVE
      }, { availableTickets: remTickets});

      if (!eventone) {
        return res.status(404).send("Event not found");
      }

      return res.status(200).send({ availableTickets: remTickets });
      //return res.redirect('/userEventDetails?eventId=' + eventone.eventId + '&eventName=' + eventone.eventName);
    }
  }
  catch (e) {
    res.status(500).send();
  }
});

//To update the like status for an event
router.post('/like', async (req, res) => {
  try {
    const user = req.session.user;

    let likeEvent = await Like.findOneAndUpdate({
        eventId : req.body.eventId, 
        eventName : req.body.eventName,
        userId : user.userId, 
        userName : user.name
    }, { liked: req.body.liked });

    if (!likeEvent) {
      let likeEvent = new Like({
        eventId : req.body.eventId, 
        eventName: req.body.eventName,
        userId : user.userId, 
        userName : user.name,
        liked: req.body.liked
      });

      //count of total no. of likes
      const idCount = await Like.countDocuments({});

      //initialise likeId
      likeEvent.likeId = idCount + 1,
      
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
    const user = req.session.user;
    let comment = new Comment({
      eventId : req.body.eventId, 
      eventName: req.body.eventName,
      userId : user.userId, 
      userName : user.name,
      comment: req.body.comment
    });
    
    //count of total no. of comments
    const idCount = await Comment.countDocuments({});

    //initialise commentId
    comment.commentId = idCount + 1, 
    
    await comment.save();
    return res.redirect('/userEventDetails?eventId=' + req.body.eventId + '&eventName=' + req.body.eventName); 
  }
  catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;

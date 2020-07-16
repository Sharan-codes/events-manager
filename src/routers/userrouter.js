const Event = require('../models/event');
//const User = require('../models/user');
const {User} = require('../models/user');
const {Like} = require('../models/user');
const {Comment} = require('../models/user');
const express = require('express');
const router = new express.Router();

router.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({ name: req.body.name });

    if (user) {
      if (user.password !== req.body.password) {
      	return res.status(400).send("Invalid Password");
      }
      req.session.user = user;
      console.log(req.session.user);
      
      if (user.name === "admin") {
        return res.redirect('addevent.html');
      } 
      
      return res.redirect('/userViewEvents');
      }

    user = new User(req.body);
    
    await user.save();
    // res.status(201).send(user.name+" registered");
    return res.redirect('register_success.html'); 
    }
    catch (e) {
      res.status(400).send(e);
    }
});

router.get('/logout', function(req, res) {
  let user = req.session.user.name;
  req.session.destroy(function(err){  
    if(err) {  
      console.log(err); 
      res.status(400).send(e);
    }  
    else {  
      console.log(user+' logged out successfully!'); 
      return res.redirect('login.html');
    }  
  });
});

router.get('/', (req, res) => {
  if(req.session.user){  
    console.log(req.session.user); 
    if (req.session.user.name === "admin") {
      return res.redirect('addevent.html');
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

router.get('/userViewEvents', async (req, res) => {
	try {
      const dateTimeNow =new Date();
      console.log(dateTimeNow)
      const events = await Event.find({
        bookStartTime: { $lte : dateTimeNow},
        bookEndTime: { $gte : dateTimeNow},
        status: 1
      });
      res.render('pages/userviewevents', { title: 'Events', records: events, user: req.session.user.name });
			// res.send(events);
	} catch (e) {
			res.status(500).send();
	}
});

router.get('/userEventDetails', async (req, res) => {
	try {
      const event = await Event.findOne({eventName : req.query.eventName});
      if (!event) {
        return res.status(404).send("Event not found");
      }
      const user = req.session.user.name;
      let likeEvent= await Like.findOne({
          eventName : req.query.eventName,
          userName : user
        });
      let isLiked = FALSE;
      if (likeEvent) {
        isLiked = likeEvent.liked;
      }
      const totalLikes = await Like.countDocuments({
        eventName : req.query.eventName,
        liked : TRUE})

      const comments = await Comment.find({
        eventName : req.query.eventName
      });
      
      res.render('pages/usereventdetails', { title: 'Event details', event : event, totalLikes : totalLikes, isLiked : isLiked, records: comments });
		// res.send(events);
	    } catch (e) {
		  res.status(500).send();
	}
});

router.post('/buyTickets', async (req, res) => {
  try {
      const event = await Event.findOne({
        eventName : req.query.eventName,
        status : 1
      });
      if (!event) {
        return res.status(404).send("Event not found");
      }
      if(req.body.numTickets > event.availableTickets)
      {
        return res.redirect('/userEventDetails?eventName='+req.query.eventName);
      }
      else{

      let remTickets = event.availableTickets - req.body.numTickets;
      const eventone = await Event.findOneAndUpdate({
        eventName : req.query.eventName,
        status : 1
      }, { availableTickets: remTickets});
    if (!eventone) {
      return res.status(404).send("Event not found");
    }
    return res.redirect('/userEventDetails?eventName='+eventone.eventName);  }
  }
  catch (e) {
    res.status(500).send();
  }
});

router.post('/like', async (req, res) => {
  try {
    const user = req.session.user.name;

    let likeEvent= await Like.findOneAndUpdate({
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
    console.log(likeEvent);
    return res.redirect('/userEventDetails?eventName='+req.body.eventName); 
    }
    catch (e) {
      res.status(400).send(e);
    }
});

router.post('/comment', async (req, res) => {
  try {
    const user = req.session.user.name;
    let comment = new Comment({
      eventName: req.body.eventName,
      userName : user,
      comment: req.body.comment
    });
    
    await comment.save(); 
    return res.redirect('/userEventDetails?eventName='+req.body.eventName); 
    }
    catch (e) {
      res.status(400).send(e);
    }
});

module.exports = router;
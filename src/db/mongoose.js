const mongoose = require('mongoose');

//mongodb://127.0.0.1:27017/events-manager
mongoose.connect('mongodb+srv://mongodbuser:mongodbuser@cluster0.ephto.mongodb.net/events-manager?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useCreateIndex : true,
  useUnifiedTopology: true,
  useFindAndModify : false
});


var bodyParser = require('body-parser');
const express = require('express');
var session = require('express-session');
require('./db/mongoose');
const userRouter = require('./routers/userrouter');
const adminRouter = require('./routers/adminrouter');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('src/public'));
app.use(bodyParser.urlencoded({ 
  extended: true
}));
app.use(session({
  secret: 'djhxcvxfgshjfgjhgsjhfgakjeauytsdfy',
  resave: false,
  saveUninitialized: true
}));
app.use(userRouter);
app.use(adminRouter);
app.set('views', __dirname+'\\views');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
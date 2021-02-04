const express = require("express");
const expressValidator = require('express-validator');
const session= require('express-session');
const flash = require('express-flash');
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser');
const methodOverride = require('method-override');
const { expressCspHeader, NONCE, INLINE, NONE, SELF} = require('express-csp-header');

const routes = require('./app/routes/routes');
const path = require("path")
const app = express();
const moment= require('moment');

// Setting locals
app.locals.moment=moment;
app.locals.shortDateFormat="MM/DD/YYYY";

// Using ejs template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.use(express.static(__dirname + '/app/public'));

app.use(expressCspHeader({
  directives: {
    'default-src': [NONCE, INLINE, NONE, SELF],
    'img-src': [NONCE, INLINE, NONE, SELF],
  }
}));

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type: application/json
app.use(bodyParser.json());

app.use(expressValidator());
app.use(cookieParser('keyboard cat'));
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(flash());
app.use(bodyParser.json());
app.use('/', routes);

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
  const session = require('express-session');

const postgres = require('pg');
const Pool = postgres.Pool;

// initialise session middleware - flash-express depends on it
app.use(session({
  secret : "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());

let useSSL = false;
if(process.env.DATABASE_URL){
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/registration_numbersDB'

const pool = new Pool({
  connectionString,
  ssl:useSSL
})

let RegistrationNumbers = require('./registration_numbers');
const regNumbers = RegistrationNumbers(pool);
const registrationRoutes = require('./registration_routes');
const RegRoutesFactory = registrationRoutes(regNumbers);



let PORT = process.env.PORT || 3600;

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.listen(PORT, function() {
  console.log('App starting on port', PORT);
});

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('home');
});

// app.get('/greetings', function (req, res) {
//     req.flash('info', 'Flash Message Added');
//     res.redirect('/');
// });

app.post('/registration_numbers', RegRoutesFactory.registrations);

app.get('/filter/:town_name', RegRoutesFactory.filtered);

app.post('/clear', RegRoutesFactory.clear);

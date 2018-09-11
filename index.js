const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

let Greetings = require('./greetings');

const postgres = require('pg');
const Pool = postgres.Pool;

let useSSL = false;
if(process.env.DATABASE_URL){
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/registration_numbersDB'

const pool = new Pool({
  connectionString,
  ssl:useSSL
})

const regNumbers = RegistrationNumbers(pool);
const RegistrationRoutes = require('./registration_routes');
const RegRoutesFactory = RegistrationRoutes(regNumbers);



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

app.post('/registration_numbers', RegRoutesFactory.greetings);

// app.get('/greeted', greetRoutesFactory.greeted);

app.get('/filter/:location', RegRoutesFactory.greetedUser);

app.post('/clear', RegRoutesFactory.clear);

app.get('');
// back button route
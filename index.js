/**
 * 
 * Code for the server functions, using express
 * Code calls functions from queries.js and also has all the get and post request handeling
 * Made by Nividh Singh
 * 
 */

const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000
var cookieParser = require('cookie-parser');

app.set('view engine', 'ejs')


app.use(cookieParser());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', request.headers.origin);
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/username', (request, response) => {
  //console.log(request.cookies)
  response.send("<html><head></head><body><p>" + request.cookies.username + "</p></body></html>")
})

//About Me Page
app.get('/aboutme', (request, response) => {
  db.checkAccess(request, response, "aboutme")
})

// Page for Single Post
app.get('/post', (request, response) => {
  db.getPostByID(request, response);
})

// Logs user out and redirects them to the home page
app.get('/logout', (request, response) => {
  //response.send("<p>logs<p>")
  response.status(200).clearCookie('username').redirect('/')//cookie('username', request.cookies.username, { maxAge: - 10 }).redirect('/');
})

// Page with all the blogs
app.get('/', (request, response) => {
  db.checkAccess(request, response, "/");
});

// Login Page, also logs user out
app.get('/login', (request, response) => {
  response.status(200).cookie('username', request.cookies.username, { maxAge: - 100 }).render("login", { errorMessage: "", logedin: false });
});

// Logs user in
app.post('/login', (request, response) => {
  db.loginUser(request, response);
});

// Signup Page, also signs user out
app.get('/signup', (request, response) => {
  response.status(200).cookie('username', request.cookies.username, { maxAge: - 10 }).render("signup", { errorMessage: "", logedin: false });
});

// Calls function to sign user up
app.post('/signup', (request, response) => {
  db.createUser(request, response);
});

// Page to make a new blog post
app.get('/createblog', (request, response) => {
  db.checkAccess(request, response, "createblog");
});

// Creates new post
app.post('/createblog', (request, response) => {
  db.createPost(request, response);
});

// Page with about me history
app.get('/aboutmehistory', (request, response) => {
  db.checkAccess(request, response, "aboutmehistory");
});

// Reverts to previous about me
app.get('/revert', (request, response) => {
  db.checkAccess(request, response, "revert");
});

// Page with form to change about me
app.get('/changeaboutme', (request, response) => {
  db.checkAccess(request, response, "changeaboutme");
});

// Change about me section
app.post('/changeaboutme', (request, response) => {
  db.changeaboutme(request, response);
});

/*app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})*/

module.exports = app;

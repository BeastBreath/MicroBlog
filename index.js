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


/*app.get('/posts', (request, response) => {
    
})

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
  console.log('Cookies: ', request.cookies);
})*/


app.get('/aboutme', (request, response) => {
  if(db.checkLogedIn(request)) {
    console.log("About me")
    db.aboutMePage(request, response);
  }
  else {
    response.status(403).render("login", {errorMessage: "You need to log in to have access to this page", logedin: false})
  }
})

app.get('/post', (request, response) => {
  
  db.getPostByID(request, response);
  
})

app.get('/logout', (request, response) => {
  console.log(request.cookies)
  response.cookie('username', request.cookies.username, {maxAge: - 10}).redirect('/');
  
})

app.get('/', (request, response) => {
  
  console.log(request.cookies)

  if (db.checkLogedIn(request)) {
    db.getPostsByUser(request, response)
  }
  else {
    db.getPosts(request, response)
  }
});



app.get('/login', (request, response) => {
    response.status(200).cookie('username', request.cookies.username, {maxAge: - 10}).render("login", {errorMessage: "", logedin: false})

});

app.get('/signup', (request, response) => {

    response.status(200).cookie('username', request.cookies.username, {maxAge: - 10}).render("signup", {errorMessage: "", logedin: false})

});

app.post('/signup', (request, response) => {

    console.log("Post: Signup")

    db.createUser(request, response)

    console.log(request.body.username + " " + request.body.password + " " + request.body.head + " " + request.body.aboutme);
})



app.get('/createblog', (request, response) => {
  if (db.checkLogedIn(request)) {
    response.status(200).render("createpost", {logedin: true})
  }
  else {
    response.status(403).render("login", {errorMessage: "You need to log in to have access to this page", logedin: false})
  }

});

app.get('/aboutmehistory', (request, response) => {
  if (db.checkLogedIn(request)) {
    db.aboutmehistory(request, response)
  }
  else {
    response.status(403).render("login", {errorMessage: "You need to log in to have access to this page", logedin: false})
  }
})

app.get('/revert', (request, response) => {
  if (db.checkLogedIn(request)) {
    db.revert(request, response)
  }
  else {
    response.status(403).render("login", {errorMessage: "You need to log in to have access to this page", logedin: false})
  }
})

app.post('/createblog', (request, response) => {
  if (db.checkLogedIn(request)) {
    db.createPost(request, response)
  }
  else {
    response.status(403).render("login", {errorMessage: "You need to log in to have access to this page", logedin: false})
  }

})

app.get('/changeaboutme', (request, response) => {
  if (db.checkLogedIn(request)) {
    response.render("changeaboutme", {logedin: true})
  }
  else {
    response.status(403).render("login", {errorMessage: "You need to log in to have access to this page", logedin: false})
  }
})

app.post('/changeaboutme', (request, response) => {

  db.changeaboutme(request, response)

})

app.post('/login', (request, response) => {
    let username = request.body.username;
    let password = request.body.passwd;
    console.log("HERE2")
    console.log(username + " " + password);

    db.loginUser(request, response)
    //Add code to add it to the db here
})


app.get('/allposts', db.getPosts)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
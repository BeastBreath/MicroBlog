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


app.get('/test', (request, response) => {
  console.log("test")
  response.render("test", {testvar: "test", logedin: "true"})
})

app.get('/home2', function(request, response) {
    console.log('Cookies: ', request.cookies);
    const username = request.cookies.username

    response.send('<h1>' + username + '<h1>')
    //response.send({'username': username})
});

app.get('/aboutme', (request, response) => {
  console.log("About me")
  db.aboutMePage(request, response);
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

  if (request.cookies.username !== undefined) {
    db.getPostsByUser(request, response)
  }
  else {
    db.getPosts(request, response)
  }

  
  //console.log(db.getPostsByUser(request, response))
  //response.sendStatus(200).json(db.getPostsByUser(request, response))  
  //response.render("posts", {logedin: "false", posts: db.getPostsByUser})
  
  //response.sendFile(path.join(__dirname, '/index.html'));
  });

app.get('/login', function(request, response) {
    response.render("login", {errorMessage: "", logedin: "false"})

    //response.sendFile(path.join(__dirname, '/login.html'));
});

app.get('/signup', function(request, response) {
    response.render("signup", {errorMessage: "", logedin: "true"})

    //response.sendFile(path.join(__dirname, '/signup.html'));
});

app.post('/signup', (request, response) => {

    console.log("Post: Signup")

    db.createUser(request, response)

    console.log(request.body.username + " " + request.body.password + " " + request.body.head + " " + request.body.aboutme);
})



app.get('/createblog', (request, response) => {
  if (request.cookies.username !== undefined) {
    response.render("createpost", {logedin: "true"})
  }
  else {
    response.redirect('/login')
  }

});

app.get('/aboutmehistory', (request, response) => {
  db.aboutmehistory(request, response)
})

app.post('/createblog', (request, response) => {

    db.createPost(request, response)

})

app.get('/changeaboutme', (request, response) => {
  response.render("changeaboutme", {logedin: "true"})
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

/*app.get("/posts", async (request, response) => {
    const rows = await db.getPosts();
    response.setHeader("content-type", "application/json")
    response.send(JSON.stringify(rows))
})*/

app.get('/posts', db.getPosts)
/*
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)*/

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
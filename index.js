/**
 * 
 * Code for the server functions, using express
 * Code calls functions from queries.js and also has all the get and post reqest handeling
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
app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
    //res.send({'username': username})
});

app.get('/aboutme', (request, response) => {
  console.log("About me")
  db.aboutMePage(req, res);
})

app.get('/post', (req, res) => {
  

  db.getPostByID(req, res);
  
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '/login.html'));
});

app.get('/signup', function(request, response) {
    response.render("test", {testvar: "test", logedin: "true"})

    //res.sendFile(path.join(__dirname, '/signup.html'));
});

app.post('/signup', (req, res) => {

    db.createUser(req, res)

    let username = req.body.username;
    let password = req.body.passwd;
    console.log("HERE")
    console.log(username + " " + password);

    //res.send("success")
    //Add code to add it to the db here

})



app.get('/createblog', (req, res) => {
    res.sendFile(path.join(__dirname, '/createblog.html'));
});

app.post('/createblog', (req, res) => {

    db.createPost(req, res)

})

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.passwd;
    console.log("HERE2")
    console.log(username + " " + password);

    db.loginUser(req, res)
    //Add code to add it to the db here
})

/*app.get("/posts", async (req, res) => {
    const rows = await db.getPosts();
    res.setHeader("content-type", "application/json")
    res.send(JSON.stringify(rows))
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
const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000
var cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


app.get('/posts', (request, response) => {
    
})

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
  console.log('Cookies: ', request.cookies);
})

app.get('/home', function(req, res) {
    const username = req.query.username;

    res.send('<h1>' + username + '<h1>')
    //res.send({'username': username})
});

app.get('/idkyet', function(req, res) {
    res.render('register', {
        message: 'User registered!'
    });
  });


//app.get('/', function(req, res) {
 //   res.sendFile(path.join(__dirname, '/index.html'));
  //});

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '/login.html'));
});

app.get('/signup', function(req, res) {
    res.cookie('test', 'testing').sendFile(path.join(__dirname, '/signup.html'));
});

app.post('/signup', (req, res) => {

    db.createUser(req, res)

    let username = req.body.username;
    let password = req.body.password;
    console.log("HERE")
    console.log(username + " " + password);

    //res.send("success")
    //Add code to add it to the db here
})

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log("HERE")
    console.log(username + " " + password);

    res.cookie('username', username).send('cookie set'); //Sets name = express

    res.send("success")
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
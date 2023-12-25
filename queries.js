/**
 * 
 * File for the all the query functions
 * Made by Nividh Singh
 * 
 */

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'microblog',
  password: 'sSchool@19',
  port: 5432,
})

const getPosts = (request, response) => {
    pool.query('Select * FROM blogposts', (error, results) => {
        if (error) {
            throw error
        }
        response.render("posts", {logedin: false, posts: results.rows})
    })
}
const aboutmehistory = (request, response) => {
    pool.query('SELECT * FROM userhistory WHERE username=$1', [request.cookies.username], (error, results) => {
        if (error) throw error
        console.log("Beefore")
        console.log(results.rows)
        console.log("afteer")
        response.render("aboutmehistory", {logedin: "true", history: results.rows})
    })
}

const getPostsByUser = (request, response) => {

    const username = request.cookies.username
    pool.query('SELECT * FROM blogposts WHERE username=$1', [username], (error, results) => {
        if (error) {
            throw error
        }

        //console.log(results.rows)
        response.render("posts", {logedin: "true", posts: results.rows})

        
    })
}

const getPostByID = (request, response) => {

    pool.query('SELECT * FROM blogposts WHERE blogid=$1',
    [request.query.blogid], (error, results) => {
        if (error) {
            throw error
        }
        title = results.rows[0].title
        console.log((request.cookies.username !== undefined))
        response.render("singlepost", {logedin: (request.cookies.username !== undefined), post: results.rows[0]})
    })
}

const createPost = (request, response) => {
    
    const {title, Message} = request.body

    console.log(request.body)

    pool.query('INSERT INTO blogposts (title, msg, username) VALUES ($1, $2, $3)',
    [title, Message, request.cookies.username], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).redirect('/')
        //response.cookie('username', username).redirect('/')
    })
}


const changeaboutme = (request, response) => {
    
    const {newHeader, newAboutMe} = request.body

    pool.query('UPDATE users SET head=$1, aboutme=$2 WHERE username=$3', [newHeader, newAboutMe, request.cookies.username], (error, results) => {
        if (error) throw error

    })

    pool.query('INSERT INTO userhistory (head, aboutme, username) VALUES($1, $2, $3)', [newHeader, newAboutMe, request.cookies.username], (error, results) => {
        if (error) throw error
        response.status(201).redirect('/aboutme')
        //response.cookie('username', username).redirect('/')
    })
}


const createUser = (request, response) => {
    
    console.log("In this function")
    const {username, passwd, head, aboutme} = request.body

    console.log(request.body)

    pool.query('SELECT * FROM users WHERE username=$1', [username], (error, results) => {
        if (error) throw error;

        if (results.rows.length > 0) {
            console.log("username taken")
            response.render("signup", {errorMessage: "Username Taken", logedin: "true"})
            //response.send('Username taken').end()
            return;
        }
        else {

            pool.query('INSERT INTO users (username, passwd, head, aboutme) VALUES ($1, $2, $3, $4)',
                [username, passwd, head, aboutme], (error, results) => {
            if (error) throw error
                //response.cookie('username', username).redirect('/')
            })

            pool.query('INSERT INTO userhistory (head, aboutme, username) VALUES ($1, $2, $3)', 
                [head, aboutme, username], (error, results) => {
                    if (error) throw error
                })
                
            response.cookie('username', username).status(201).redirect('/');
        }
    })
}

const loginUser = (request, response) => {

    const {username, passwd} = request.body

    console.log("In login function")
    
    console.log(username + " " + passwd)    
    
    pool.query("SELECT * FROM users WHERE username=$1 AND passwd=$2", [username, passwd], (error, results, fields) => {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.rows.length > 0) {
            // Authenticate the user
            response.cookie('username', username).redirect('/');
        } else {
            console.log(results)
            response.render("login", {errorMessage: "Incorrect Username and/or Password!", logedin: "false"})
        }			
        response.end();
    });
}

const aboutMePage = (request, response) => {

    console.log("in about me page function")
    console.log(request.cookie)
    pool.query("SELECT * FROM users WHERE username=$1", [request.cookies.username], (error, results) => {
        if (error) throw error;
        
        console.log(results)
        head = results.rows[0].head
        aboutme = results.rows[0].aboutme

        response.render("aboutme", {username: request.cookies.username, logedin: true, head: head, aboutme: aboutme})
        
    })

}

const updateUser = (request, response) => {

    console.log("Updating User")

    const {head, aboutme} = request.body

    pool.query("UPDATE users SET head=$1 AND aboutme=$2 WHERE username=$3", [head, aboutme, request.cookies.username], (error, results, fields) => {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.rows.length > 0) {
            // Authenticate the user
            response.cookie('username', username).redirect('/home');
        } else {
            console.log(results)
            response.send('Incorrect Username and/or Password!');
        }			
        response.end();
    });
}



/*
const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}
*/
module.exports = {
    getPosts,
    getPostsByUser,
    createPost,
    createUser,
    loginUser,
    updateUser,
    getPostByID,
    aboutMePage,
    changeaboutme,
    aboutmehistory
}
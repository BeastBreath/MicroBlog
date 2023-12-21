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
        response.status(200).json(results.rows)
    })
}

const getPostsByUser = (request, response) => {
    const username = request.params.username
    pool.query('SELECT * FROM blogposts WHERE username=$1', [username], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
        
    })
}

const createUser = (request, response) => {
    
    console.log("In this function")
    const {username, passwd, hd, aboutme} = request.body

    console.log(request.body)

    pool.query('INSERT INTO users (username, passwd, head, aboutme) VALUES ($1, $2, $3, $4)',
    [username, passwd, hd, aboutme], (error, results) => {
        if (error) {
            throw error
        }
        response.cookie('username', username).status(201).send('User added')
        //response.cookie('username', username).redirect('/')
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
    createUser,
    loginUser
}
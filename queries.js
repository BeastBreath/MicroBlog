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
        response.status(200).cookie('username', username).json(results.rows)
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
        response.status(201).send('User added')
    })
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
    createUser
  /*getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,*/
}
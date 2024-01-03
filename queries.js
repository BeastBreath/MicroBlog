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
    password: '1234',
    port: 5432,
})

function checkLogedIn(request) {
    return request.cookies.username;
}

function checkAccess(request, response, funcName) {
    if (checkLogedIn(request)) {
        if (funcName == "aboutme") { aboutMePage(request, response); }
        else if (funcName == "/") { getPostsByUser(request, response); }
        else if (funcName == "createblog") { response.status(200).render("createpost", { logedin: true }); }
        else if (funcName == "aboutmehistory") { aboutmehistory(request, response); }
        else if (funcName == "revert") { revert(request, response); }
        else if (funcName == "changeaboutme") { response.status(200).render("changeaboutme", { logedin: true }) };
    }
    else {
        if (funcName == "/") { getPosts(request, response); }
        else { response.status(403).render("login", { errorMessage: "You need to log in to have access to this page", logedin: false }); }
    }
}

function insertIntoTransactions(q) {
    pool.query('INSERT INTO transactions (transaction) VALUES ($1)', [q], (error, results) => {
        if (error) { throw error; }
    });
}

const getPosts = (request, response) => {

    pool.query('SELECT * FROM blogposts', (error, results) => {
        if (error) { throw error; response.status(500); }

        var q = 'SELECT * FROM blogposts'
        insertIntoTransactions(q);

        response.status(200).render("posts", { logedin: checkLogedIn(request), posts: results.rows })
    })


}

const aboutmehistory = (request, response) => {
    pool.query('SELECT * FROM userhistory WHERE username=$1', [request.cookies.username], (error, results) => {
        if (error) { throw error; response.status(500); }

        var q = 'SELECT * FROM userhistory WHERE username=' + request.cookies.username
        insertIntoTransactions(q);

        response.status(200).render("aboutmehistory", { logedin: checkLogedIn(request), history: results.rows })
    })

}

const getPostsByUser = (request, response) => {

    const username = request.cookies.username
    pool.query('SELECT * FROM blogposts WHERE username=$1', [username], (error, results) => {
        if (error) { throw error; response.status(500); }

        var q = 'SELECT * FROM blogposts WHERE username=' + username
        insertIntoTransactions(q);

        response.status(200).render("posts", { logedin: checkLogedIn(request), posts: results.rows })
    })
}

const getPostByID = (request, response) => {

    pool.query('SELECT * FROM blogposts WHERE blogid=$1', [request.query.blogid], (error, results) => {
        if (error) { throw error; response.status(500); }

        var q = 'SELECT * FROM blogposts WHERE blogid=' + request.query.blogid
        insertIntoTransactions(q);

        const title = results.rows[0].title
        response.status(200).render("singlepost", { logedin: checkLogedIn(request), post: results.rows[0] })
    });

}

const createPost = (request, response) => {

    const { title, Message } = request.body

    pool.query('INSERT INTO blogposts (title, msg, username) VALUES ($1, $2, $3)', [title, Message, request.cookies.username], (error, results) => {
        if (error) { throw error; response.status(500); }

        var q = 'INSERT INTO blogposts (title, msg, username) VALUES (' + title + ', ' + Message + ', ' + request.cookies.username + ')'
        insertIntoTransactions(q);

        response.status(201).redirect('/')
    })
}


const changeaboutme = (request, response) => {

    const { newHeader, newAboutMe } = request.body

    pool.query('UPDATE users SET head=$1, aboutme=$2 WHERE username=$3', [newHeader, newAboutMe, request.cookies.username], (error, results) => {
        if (error) { throw error; response.status(500); }

        var q = 'UPDATE users SET head=' + newHeader + ', aboutme=' + newAboutMe + ' WHERE username=' + request.cookies.username
        insertIntoTransactions(q);

    })

    pool.query('INSERT INTO userhistory (head, aboutme, username) VALUES($1, $2, $3)', [newHeader, newAboutMe, request.cookies.username], (error, results) => {
        if (error) { throw error; response.status(500); }
        response.status(302).redirect('/aboutme')

        var q = 'INSERT INTO userhistory (head, aboutme, username) VALUES (' + newHeader + ', ' + newAboutMe + ', ' + request.cookies.username + ')'
        insertIntoTransactions(q);
    })

}


const createUser = (request, response) => {

    const { username, passwd, head, aboutme } = request.body


    pool.query('SELECT * FROM users WHERE username=$1', [username], (error, results) => {
        if (error) { throw error; response.status(500); }

        var q = 'SELECT * FROM users WHERE username=' + username
        insertIntoTransactions(q);

        if (results.rows.length > 0) {
            response.status(200).render("signup", { errorMessage: "Username Taken", logedin: checkLogedIn(request) })
            return;
        }
        else {

            pool.query('INSERT INTO users (username, passwd, head, aboutme) VALUES ($1, $2, $3, $4)',
                [username, passwd, head, aboutme], (error, results) => {
                    if (error) { throw error; response.status(500); }

                    var q = 'INSERT INTO users (username, passwd, head, aboutme) VALUES (' + username + ', ' + passwd + ', ' + head + ', ' + aboutme + ')'
                    insertIntoTransactions(q);

                })

            pool.query('INSERT INTO userhistory (head, aboutme, username) VALUES ($1, $2, $3)',
                [head, aboutme, username], (error, results) => {
                    if (error) { throw error; response.status(500); }

                    var q = 'INSERT INTO userhistory (head, aboutme, username) VALUES (' + head + ', ' + aboutme + ', ' + username + ')'
                    insertIntoTransactions(q);
                })

            response.status(201).cookie('username', username).redirect('/');
        }
    })

}

const loginUser = (request, response) => {

    const { username, passwd } = request.body

    pool.query("SELECT * FROM users WHERE username=$1 AND passwd=$2", [username, passwd], (error, results, fields) => {
        // If there is an issue with the query, output the error
        if (error) { throw error; response.status(500); }

        var q = 'SELECT * FROM users WHERE username=' + username + ' AND passwd=' + passwd
        insertIntoTransactions(q);

        // If the account exists
        if (results.rows.length > 0) {
            // Authenticate the user
            response.status(200).cookie('username', username).redirect('/');
        } else {
            response.status(401).render("login", { errorMessage: "Incorrect Username and/or Password!", logedin: checkLogedIn(request) })
        }
        response.end();
    });
}

const aboutMePage = (request, response) => {

    pool.query("SELECT * FROM users WHERE username=$1", [request.cookies.username], (error, results) => {
        if (error) { throw error; response.status(500); }

        var q = 'SELECT * FROM users WHERE username=' + request.cookies.username
        insertIntoTransactions(q);

        const head = results.rows[0].head
        const aboutme = results.rows[0].aboutme
        response.status(200).render("aboutme", { username: request.cookies.username, logedin: checkLogedIn(request), head: head, aboutme: aboutme })

    })

}

const updateUser = (request, response) => {

    const { head, aboutme } = request.body

    pool.query("UPDATE users SET head=$1 AND aboutme=$2 WHERE username=$3", [head, aboutme, request.cookies.username], (error, results, fields) => {

        if (error) { throw error; response.status(500); }

        var q = 'UPDATE users SET head=' + head + ' AND aboutme=' + aboutme + ' WHERE USERNAME=' + request.cookies.username
        insertIntoTransactions(q);

        if (results.rows.length > 0) {

            response.status(200).cookie('username', username).redirect('/home');
        } else {
            response.status(500);
        }
        response.end();
    });
}

const revert = (request, response) => {
    pool.query('SELECT * FROM userhistory WHERE v=$1', [request.query.v], (error, results) => {
        if (error) { throw error; response.status(500); }

        var q = 'SELECT * FROM userhistory WHERE v=' + request.query.v
        insertIntoTransactions(q);

        const head = results.rows[0].head
        const aboutme = results.rows[0].aboutme
        const username = request.cookies.username

        pool.query('UPDATE users SET head=$1, aboutme=$2 WHERE username=$3', [head, aboutme, username], (error) => {
            if (error) { throw error; response.status(500); }

            var q = 'UPDATE users SET head=' + head + ', aboutme=' + aboutme + ' WHERE username=' + request.cookies.username
            insertIntoTransactions(q);

        })
        pool.query('INSERT INTO userhistory (head, aboutme, username) VALUES ($1, $2, $3)', [head, aboutme, username], (error) => {
            if (error) { throw error; response.status(500); }

            var q = 'INSERT INTO userhistory (head, aboutme, username) VALUES (' + head + ', ' + aboutme + ', ' + username + ')'
            insertIntoTransactions(q);
        })
        response.status(200).render("aboutme", { username: username, logedin: checkLogedIn(request), head: head, aboutme: aboutme })
    });

}

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
    aboutmehistory,
    checkLogedIn,
    revert,
    checkAccess
}
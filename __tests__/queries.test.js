module.exports = { presets: ['@babel/preset-env'] }


/*import {
    getPosts, getPostsByUser, createPost, createUser, loginUser, updateUser,
    getPostByID, aboutMePage, changeaboutme, aboutmehistory, checkLogedIn, revert,
} from '../queries.js'*/

//import { getPosts, aboutmehistory, checkLogedIn } from '../queries'


const request = require('supertest');
const express = require('express');
const app = require('../index'); // Update the path to point to your Express app file

describe('GET /render-page', () => {
    it('should render the page with "Hello, World!"', () => {
        const response = request(app).get('/aboutme');

        expect(response.status).toBe(200);
        expect(response.text).toContain('about');
    });
});

/*describe('Test Functions', () => {
    test('Create Post if not logged in', () => {
        const req = { cookies: { 'username': 'user1' } }
        const res = { text: '', send: function (input) { this.text = input } }

        checkLogedIn(req, res, "aboutmehistory");

        expect(res.text).toContain("login");
        console.log(res)

    })
})*/
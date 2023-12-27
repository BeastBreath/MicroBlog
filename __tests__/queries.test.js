module.exports = { presets: ['@babel/preset-env'] }


/*import {
    getPosts, getPostsByUser, createPost, createUser, loginUser, updateUser,
    getPostByID, aboutMePage, changeaboutme, aboutmehistory, checkLogedIn, revert,
} from '../queries.js'*/

//import { getPosts, aboutmehistory, checkLogedIn } from '../queries'


const request = require('supertest');
const express = require('express');
const app = require('../index'); // Update the path to point to your Express app file
const agent = request.agent(app); // <-- Important

describe('Test Cookies', () => {
    it('wrong', async () => {
        const response = await agent
            .get('/username')
            .set('Cookie', 'username=User1')
            .send({});

        expect(response.status).toBe(200);
        expect(response.text).toContain('User1');
    });

    it('Correct one', async () => {
        const response = await request(app).get('/username').set("Cookie", ['username=user1']);//.set("Cookie", { "username": "user1" });

        expect(response.status).toBe(200);
        expect(response.text).toContain('user1');
    });
});
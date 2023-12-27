module.exports = { presets: ['@babel/preset-env'] }


const request = require('supertest');
const express = require('express');
const app = require('../index'); // Update the path to point to your Express app file
const agent = request.agent(app); // <-- Important

describe('Testing Microblog Application', () => {

    afterEach(() => {
        agent
            .get('/logout')
            .send({});
    })

    // Test Signup Page
    describe('Test Signup', () => {
        it('GET /signup', async () => {
            const response = await agent
                .get('/signup')
                .send({});

            expect(response.status).toBe(200);
            expect(response.text).toContain('Sign Up');
        });
        it('POST /signup with new User', async () => {
            const newUser = {
                username: 'JESTUser',
                passwd: 'JEST123',
                head: 'JESTHeader',
                aboutme: 'JESTAboutMe',
            };

            const response = await agent
                .post('/signup')
                .send(newUser);

            expect(response.status).toBe(302);
            expect(response.headers['set-cookie']).toBeDefined();
            expect(response.headers.location).toBe('/');
        })

        it('POST /signup with existing account (Should not create a new user)', async () => {
            const newUser = {
                username: 'JESTUser',
                passwd: 'JEST123',
                head: 'JESTHeader',
                aboutme: 'JestAboutMe',
            };

            const response = await agent
                .post('/signup')
                .send(newUser);

            expect(response.status).toBe(200);
            expect(response.text).toContain('Sign Up');
            expect(response.text).toContain('Username Taken');
        })
    });

    describe('Test login', () => {
        it('GET /login', async () => {
            const response = await agent
                .get('/login')
                .send({});

            expect(response.status).toBe(200);
            expect(response.text).toContain('Log In');
        });

        it('POST /login with correct password', async () => {
            const correctUser = {
                username: 'JESTUser',
                passwd: 'JEST123',
            };

            const response = await agent
                .post('/login')
                .send(correctUser);

            expect(response.status).toBe(302);
            expect(response.headers['set-cookie']).toBeDefined();
            expect(response.headers.location).toBe('/');
        });

        it('POST /login with incorrect password', async () => {
            const wrongPasswordUser = {
                username: 'JESTUser',
                passwd: 'JEST123Wrong',
            };

            const response = await agent
                .post('/login')
                .send(wrongPasswordUser);

            expect(response.status).toBe(401);
            expect(response.text).toContain('Log In');
            expect(response.text).toContain('Incorrect Username and/or Password!');
        })

        it('POST /login with incorrect username', async () => {
            const wrongUsernameUser = {
                username: 'JESTUserWrong',
                passwd: 'JEST123',
            };

            const response = await agent
                .post('/login')
                .send(wrongUsernameUser);

            expect(response.status).toBe(401);
            expect(response.text).toContain('Log In');
            expect(response.text).toContain('Incorrect Username and/or Password!');
        })
    });

    describe('Test Log out', () => {
        it('Check if Logs out', async () => {
            const response = await agent
                .get('/logout')
                .set('Cookie', 'username=JESTUser')
                .send({});

            expect(response.status).toBe(302);
            const cookieHeader = response.headers['set-cookie'][0];
            expect(cookieHeader).not.toContain('username=JESTUser');
        });
    });

    describe('About Me Pages', () => {
        describe('About Me Page', () => {
            it('Check when logged in', async () => {
                const response = await agent
                    .get('/aboutme')
                    .set('Cookie', 'username=JESTUser')
                    .send({});

                expect(response.status).toBe(200);
                expect(response.text).toContain('About Me')
                expect(response.text).toContain('JESTHeader');
                expect(response.text).toContain('JESTAboutMe')
            });

            it('Check when not logged in', async () => {
                const response = await agent
                    .get('/aboutme')
                    .set('Cookie', 'username=')
                    .send({});

                expect(response.status).toBe(403);
                expect(response.text).toContain('Log In');
                expect(response.text).toContain('You need to log in to have access to this page');
            });
        });

        describe('Change About Me', () => {
            it('GET /changeaboutme when logged in', async () => {
                const response = await agent
                    .get('/changeaboutme')
                    .set('Cookie', 'username=JESTUser')
                    .send({});

                expect(response.status).toBe(200);
                expect(response.text).toContain('Change About Me');
            });

            it('GET /changeaboutme when not logged in', async () => {
                const response = await agent
                    .get('/changeaboutme')
                    .send({});

                expect(response.status).toBe(403);
                expect(response.text).toContain('Log In');
                expect(response.text).toContain('You need to log in to have access to this page');
            });

            it('Post /changeaboutme when logged in', async () => {
                const newAboutMe = {
                    newHeader: 'NEWJESTHeader',
                    newAboutMe: 'NEWJESTAboutMe',
                };

                const response = await agent
                    .post('/changeaboutme')
                    .set('Cookie', 'username=JESTUser')
                    .send(newAboutMe)
                    .redirects(1);

                expect(response.text).toContain('NEWJESTHeader')
                expect(response.text).toContain('NEWJESTAboutMe')
            });
        });

        describe('About Me History', () => {
            it('GET /aboutmehistory when logged in', async () => {
                const response = await agent
                    .get('/aboutmehistory')
                    .set('Cookie', 'username=JESTUser')
                    .send({});

                expect(response.status).toBe(200);
                expect(response.text).toContain('About Me History');
                expect(response.text).toContain('JESTHeader');
                expect(response.text).toContain('JESTAboutMe');
                expect(response.text).toContain('NEWJESTHeader');
                expect(response.text).toContain('NEWJESTAboutMe');
            }, 20000);

            it('GET /aboutmehistory when not logged in', async () => {
                const response = await agent
                    .get('/aboutmehistory')
                    .send({});

                expect(response.status).toBe(403);
                expect(response.text).toContain('Log In');
                expect(response.text).toContain('You need to log in to have access to this page');
            }, 20000);

            it('Post /aboutmehistory when logged in', async () => {
                const response = await agent
                    .get('/revert?v=167')
                    .set('Cookie', 'username=JESTUser')
                    .send({})

                expect(response.text).toContain('JESTHeader')
                expect(response.text).toContain('JESTAboutMe')
            }, 10000);
        });
    });

    describe('Create Blog Pages', () => {
        it('Check when logged in', async () => {
            const response = await agent
                .get('/createblog')
                .set('Cookie', 'username=JESTUser')
                .send({});

            expect(response.status).toBe(200);
            expect(response.text).toContain('Create Post');
        });

        it('Check when not logged in', async () => {
            const response = await agent
                .get('/createblog')
                .send({});

            expect(response.status).toBe(403);
            expect(response.text).toContain('You need to log in to have access to this page');
            expect(response.text).toContain('Log In');
        });

        it('POST /createblog', async () => {
            const blogDetails = {
                title: 'JESTs POST',
                Message: 'This is a very important post used by jest to test stuff',
            };

            const response = await agent
                .post('/createblog')
                .send(blogDetails)
                .redirects(1);


            expect(response.status).toBe(200);
            expect(response.text).toContain('Posts');
            expect(response.text).toContain('JESTs POST');
            expect(response.text).toContain('This is a very important post used by jest to test stuff');
        })
    });


});
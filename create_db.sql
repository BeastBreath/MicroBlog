CREATE TABLE users (
	username varchar(30) NOT NULL PRIMARY KEY,
	passwd varchar(30) NOT NULL,
	head varchar(100),
	aboutme varchar(500)
);

INSERT INTO users (username, passwd, head, aboutme)
	VALUES ('user1', 'password1', 'head1', '1: this is about me');
INSERT INTO users (username, passwd, head, aboutme)
	VALUES ('user2', 'password2', 'head2', '2: this is about me');

CREATE TABLE blogposts (
	blogid SERIAL NOT NULL PRIMARY KEY,
	title varchar(100),
	msg varchar(300),
	username varchar(30) references users(username)
);

INSERT INTO blogposts (title, msg, username)
	VALUES ('post1', 'this is the first post', 'user1');

INSERT INTO blogposts (title, msg, username)
	VALUES ('post2', 'second post', 'user1');
	
INSERT INTO blogposts (title, msg, username)
	VALUES ('post1', 'third post', 'user1');

INSERT INTO blogposts (title, msg, username)
	VALUES ('post2', 'fourth post', 'user2');

SELECT * FROM users;
--SELECT * FROM blogposts;
CREATE TABLE users (
	username varchar(30) NOT NULL PRIMARY KEY,
	passwd varchar(30) NOT NULL,
	head varchar(100),
	aboutme varchar(500)
);

CREATE TABLE blogposts (
	blogid SERIAL NOT NULL PRIMARY KEY,
	title varchar(100),
	msg varchar(300),
	username varchar(30) references users(username)
);

CREATE TABLE userhistory (
	blogid SERIAL NOT NULL PRIMARY KEY,
	title varchar(100),
	msg varchar(300),
	username varchar(30) references users(username)
);

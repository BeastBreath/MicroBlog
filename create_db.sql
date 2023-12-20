CREATE TABLE users (
	username varchar(30) NOT NULL PRIMARY KEY,
	passwd varchar(30) NOT NULL,
	header varchar(100),
	aboutme varchar(500)
);

CREATE TABLE blogposts (
	blogid SERIAL NOT NULL PRIMARY KEY,
	title varchar(100),
	msg varchar(300),
	username varchar(30) references users(username)
);

SELECT * FROM users;
--SELECT * FROM blogposts;
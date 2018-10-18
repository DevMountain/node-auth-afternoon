DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  username VARCHAR(20),
  hash text
);



DROP TABLE IF EXISTS treasures;
CREATE TABLE treasures
(
  id SERIAL PRIMARY KEY,
  image_url varchar(120),
  user_id int
);


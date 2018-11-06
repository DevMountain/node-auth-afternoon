DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  isadmin BOOLEAN default false,
  username VARCHAR(120),
  hash text
);

-- b4rni!n@t0r

INSERT INTO users
(isadmin, username, hash)
VALUES
(true, 'Trogdor', 'fakehash'),
(true, 'Travis', 'notahash'),
(false, 'Nate', 'stillnotahash');



DROP TABLE IF EXISTS treasures;
CREATE TABLE treasures
(
  id SERIAL PRIMARY KEY,
  image_url varchar(120),
  user_id int
);

INSERT INTO treasures
(image_url, user_id)
VALUES
('http://www.theholidayspot.com/easter/treasure_hunt/images/treasure-chest.png', 1),
('https://comps.canstockphoto.com/opened-treasure-chest-with-treasures-illustration_csp15511126.jpg', 2),
('https://vignette.wikia.nocookie.net/politicsandwar/images/d/d9/Treasure.jpg/revision/latest?cb=20170515133205', 3);


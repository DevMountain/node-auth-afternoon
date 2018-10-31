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
(id, isadmin, username, hash)
VALUES
(1, true, 'Trogdor', $1),
(2, true, 'Travis', 'notahash'),
(3, false, 'Nate', 'stillnotahash');



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


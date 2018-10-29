INSERT INTO users
(name, username, hash)
VALUES
($1, $2, $3)
returning *;
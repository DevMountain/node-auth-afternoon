INSERT INTO users
(isAdmin, username, hash)
VALUES
($1, $2, $3)
returning *;
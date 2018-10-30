INSERT INTO treasures
(image_url, user_id)
VALUES
($1, $2);

SELECT * FROM treasures
WHERE user_id = $2;
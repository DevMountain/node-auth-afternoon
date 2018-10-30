const bcrypt = require('bcryptjs');

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;
    const [user] = await req.app.get('db').get_user([username]);
    if (!user) {
      return res.status(401).send('User not found');
    }
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    if (!isAuthenticated) {
      return res.status(403).send('Incorrect password');
    }
    const { isadmin: isAdmin, id, userName } = user;
    req.session.user = { isAdmin, id, username: userName };

    return res.send(req.session.user);
  },

  register: async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const [existingUser] = await req.app.get('db').check_existing_user([username]);
    if (existingUser) {
      return res.status(409).send('Username taken');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    await req.app.get('db').register_user([isAdmin, username, hash]);
    return res.sendStatus(201);
  },
};

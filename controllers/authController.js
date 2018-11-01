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
    console.log('UN:', username);
    const [existingUser] = await req.app.get('db').check_existing_user([username]);
    if (existingUser) {
      return res.status(409).send('Username taken');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const [user] = await req.app.get('db').register_user([isAdmin, username, hash]);
    const { isadmin, id, username: userName } = user;
    req.session.user = { isAdmin: isadmin, id, username: userName };
    return res.status(200).send(req.session.user);
  },
  logout: (req, res) => {
    req.session.destroy();
    return res.status(200);
  },
};

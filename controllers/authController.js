const bcrypt = require('bcryptjs');

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;
    const [user] = await req.db.get_user([username]);
    if (!user) {
      return res.status(401).send('User not found');
    }
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    if (!isAuthenticated) {
      return res.status(403).send('Incorrect password');
    }
    const { name, id } = user;
    req.session.user = { name, id };

    return res.send(req.session.user);
  },

  register: async (req, res) => {
    const { username, password, name: fullName } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const [{ user_id: id, name }] = await req.db.register_user([username, hash, fullName]);
    return res.status(201).send({ id, name });
  },
};

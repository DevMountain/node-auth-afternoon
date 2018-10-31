module.exports = {
  usersOnly: (req, res, next) => {
    const { user } = req.session;
    if (!user) {
      return res.status(401).send('Please log in');
    }
    next();
  },
  adminsOnly: (req, res, next) => {
    const { isadmin } = req.session.user;
    if (!isadmin) {
      return res.status(403).send('You are not an admin');
    }
    next();
  },
};

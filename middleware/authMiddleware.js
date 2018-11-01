module.exports = {
  usersOnly: (req, res, next) => {
    const { user } = req.session;
    if (!user) {
      return res.status(401).send('Please log in');
    }
    next();
  },
  adminsOnly: (req, res, next) => {
    const { isAdmin } = req.session.user;
    console.log(isAdmin)
    if (!isAdmin) {
      return res.status(403).send('You are not an admin');
    }
    next();
  },
};

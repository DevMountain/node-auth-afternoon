module.exports = {
  dragonTreasure: async (req, res) => {
    const treasure = await req.app.get('db').get_dragon_treasure(1);
    return res.send(treasure);
  },
  getMyTreasure: async (req, res) => {
    const { id } = req.session.user;
    const myTreasure = await req.app.get('db').get_my_treasure([id]);
    res.send(myTreasure);
  },
  addMyTreasure: async (req, res) => {
    const { id } = req.session.user;
    const { treasureURL } = req.body;
    const myTreasure = await req.app.get('db').add_user_treasure([treasureURL, id]);
    return res.status(201).send(myTreasure);
  },
  getAllTreasure: async (req, res) => {
    const allTreasure = await req.app.get('db').get_all_treasure();
    return res.send(allTreasure);
  },
};

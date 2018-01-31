function index(req, res) {
  return res.render("index", req.query);
}

module.exports = {
  index
};

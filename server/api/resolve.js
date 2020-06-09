function resolve(req, res) {
  return (error, data) => {
    if (error) {
      res.status(error.code);
      res.json({ error: error.message });
    } else {
      res.status(200);
      res.json({ result: data });
    }
  };
}
module.exports = resolve;
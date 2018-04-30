const Account = require("../accounts/model")

module.exports = {
  get: (req, res) => {
    res.send({
      message: "You can access settings",
      decoded: req.decoded
    })
  }
}

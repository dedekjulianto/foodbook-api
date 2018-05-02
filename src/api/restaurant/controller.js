const Account = require("../accounts/model");
const Restaurant = require("./model");
const _ = require("lodash");

const helpers = require("../../helpers");

module.exports = {
  // GET /foods ----------------------------------------------------------------

  get: (req, res) => {
    // res.send("get restaurant list");
    Restaurant.find().exec((err, restourant) => {
      res.send(restourant);
    });
  },
  post: (req, res) => {
    Restaurant.create(
      {
        name: req.body.name,
        address: { street: req.body.street, city: req.body.city }
      },
      function(err, restaurant) {
        if (err) return handleError(err);
        // saved!
        res.send({ message: "Insert Successfully", data: restaurant });
      }
    );
  }
};

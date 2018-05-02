const Account = require("../accounts/model");
const Food = require("./model");
const _ = require("lodash");

const helpers = require("../../helpers");

module.exports = {
  // GET /foods ----------------------------------------------------------------

  get: (req, res) => {
    let searchKey = {};
    let short_by = "";
    if (req.query.most_reviewed === "true") {
      short_by = "most_reviewed";
    }
    if (req.query.city !== "" && req.query.city !== undefined) {
      searchKey = {
        "address.city": req.query.city
      };
    }

    Food.find(searchKey)
      .populate({ path: "reviews._account" })
      .exec((error, resources) => {
        if (error) res.send(error);
        resources.map((resource, index) => {
          resource.reviews = resource.reviews.reverse();
          resource.total_review = resource.reviews.length;
        });

        if (short_by === "most_reviewed") {
          resources = _.orderBy(resources, ["total_review"], ["desc"]);
        }

        res.send({ data: resources });
      });
  },

  // GET /foods/:id ------------------------------------------------------------

  getById: (req, res) => {
    Food.findOne({
      id: Number(req.params.id)
    })
      .populate({ path: "reviews._account" })
      .exec((err, resource) => {
        console.log(resource);
        res.send({ params: req.params, data: resource });
      });
  },

  // POST /foods ---------------------------------------------------------------

  post: (req, res) => {
    const body = {
      _account: req.decoded.sub,
      name: req.body.name,
      address: {
        street: req.body.street,
        city: req.body.city
      },
      coordinate: {
        latitude: req.body.latitude,
        longitude: req.body.longitude
      },
      menus: [
        {
          menu: req.body.menu,
          price: req.body.price
        }
      ],
      reviews: [
        {
          _account: req.body._account,
          comment: req.body.comment,
          rating: req.body.rating
        }
      ],
      photo: [req.body.photo]
    };

    Food.create(body, (error, food) => {
      res.send({ message: "new post has been created", data: food });
    });
  },

  // DELETE /foods -------------------------------------------------------------

  delete: (req, res) => {
    Food.remove({}, (error, account) => {
      res.send({ message: "all post has been deleted" });
    });
  },

  // DELETE /foods/:id ---------------------------------------------------------

  deleteById: (req, res) => {
    const id = req.params.id;
    Food.remove(
      {
        id: Number(id)
      },
      (error, account) => {
        res.send({
          message: `post with id: ${id} has been deleted`,
          data: account
        });
      }
    );
  },

  // PUT /foods/:id ------------------------------------------------------------

  putById: (req, res) => {
    const newFood = req.body;
    const id = req.params.id;
    Food.findOneAndUpdate(
      {
        id: Number(id)
      },
      {
        $set: newFood
      },
      {
        new: true,
        upsert: false
      },
      (error, resource) => {
        if (error) res.send({ message: "error when updating post" });
        res.send({
          message: `Foods with id: ${id} has been updated`,
          data: resource
        });
      }
    );
  },

  // PUT /foods/add_review/:id -------------------------------------------------

  addReviewById: (req, res) => {
    req.body.date = new Date();
    req.body._account = req.decoded.sub;
    const newReview = req.body;
    const id = req.params.id;

    Food.findOneAndUpdate(
      {
        id: Number(id)
      },
      {
        $push: {
          reviews: newReview
        }
      },
      {
        new: true,
        upsert: false
      },
      (error, resource) => {
        if (error) {
          res.send({ message: "error when updating post" });
        } else {
          res.send({
            message: `Food with id: ${id} has been updated`,
            data: resource
          });
        }
      }
    );
  },

  // GET /foods/review_history/:id

  getReviewHistory: (req, res) => {
    Account.findOne({
      id: Number(req.params.id)
    }).exec((err, account) => {
      if (err) return res.send(`error while getting account ID: ${err}`);
      Food.find({
        reviews: {
          $elemMatch: {
            _account: account._id
          }
        }
      })
        .populate({
          path: "reviews._account",
          select: {
            _id: 0,
            createdAt: 0,
            updatedAt: 0,
            email: 0
          }
        })
        .select({ name: 1, address: 1, photos: 1, "reviews.comment": 1 })
        .exec((err, foods) => {
          foods.map((food, index) => {
            food.reviews = food.reviews.filter(
              review => review._account.id === Number(req.params.id)
            );
          });
          res.send({ param: req.params.id, data: foods });
        });
    });
  },

  // GET /foods/get_food_by_user/:id -------------------------------------------

  getFoodByUser: (req, res) => {
    Account.findOne({
      id: Number(req.params.id)
    }).exec((err, account) => {
      if (account._id) {
        Food.find({ _account: account._id })
          .select({ name: 1, address: 1, photos: 1, id: 1 })
          .exec((err, foods) => {
            res.send({ param: req.params.id, data: foods });
          });
      } else {
        res.send({ param: req.params.id, message: "account not found" });
      }
    });
  }
};

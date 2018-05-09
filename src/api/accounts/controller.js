const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Account = require("./model");
const helpers = require("../../helpers");

module.exports = {
  // ---------------------------------------------------------------------------
  // GET /accounts
  get: (req, res) => {
    Account.find({})
      .populate({
        path: "posts"
      })
      .exec((err, accounts) => {
        res.send({
          data: accounts
        });
      });
  },
  // ---------------------------------------------------------------------------

  // GET /accounts/:id
  getById: (req, res) => {
    Account.findOne({ id: Number(req.params.id) }, (err, account) => {
      res.send({
        params: req.params,
        data: account
      });
    });
  },
  // ---------------------------------------------------------------------------

  // POST /accounts
  register: (req, res) => {
    const payload = {
      firstName: req.body.firstName || "",
      lastName: req.body.lastName || "",
      username: req.body.username || "",
      email: req.body.email || "",
      password: req.body.password || "",
      profile_picture:
        req.body.profile_picture ||
        "http://www.rt20.nl/wp-content/themes/rttheme15/images/no-profile.jpg"
    };
    console.log("payload:", payload);

    const newAccount = new Account(payload);
    console.log(payload.password);
    delete payload.password;

    newAccount.save(payload, (err, resource) => {
      if (err) res.send(err);
      else {
        res.status(200).send({ message: "succes register", data: resource });
      }
    });
  },
  // ---------------------------------------------------------------------------

  // DELETE /accounts
  delete: (req, res) => {
    Account.remove({}, error => {
      if (error) res.status(400).json({ error: error });
      res.status(200).send({ message: "All accounts have been removed." });
    });
  },
  // ---------------------------------------------------------------------------

  // DELETE /accounts/:id
  deleteById: (req, res) => {
    const id = req.params.id;
    Account.remove(
      {
        id: Number(id)
      },
      (error, resource) => {
        res.send({
          message: `post with id: ${id} has been delete`
        });
      }
    );
  },
  // ---------------------------------------------------------------------------

  // GET /accounts/bypass
  // getBypass: (req, res) => {
  //   Account.find({})
  //     // .populate({
  //     //   path: "posts"
  //     // })
  //     .exec((err, accounts) => {
  //       res.send({
  //         data: accounts
  //       })
  //     })
  // },

  // GET /accounts?username=yourname&email=yourname@domain.com
  // getByQuery: (req, res) => {
  //   const query = {
  //     username: req.params.username,
  //     email: req.params.email
  //   }
  //
  //   Account.findOne(query, (error, account) => {
  //     res.send({
  //       params: req.params,
  //       data: account
  //     })
  //   })
  // },

  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // POST /accounts/login

  login: (req, res) => {
    // Create body object

    const body = {
      username: req.body.username,
      password: req.body.password
    };
    console.log("username:", req.body.username);
    console.log("password:", req.body.password);

    // Find one account by username
    Account.findOne({ username: body.username })
      .then(account => {
        console.log("account: ", account);
        const validPassword = bcrypt.compareSync(
          body.password,
          account.password
        );
        //
        // console.log(validPassword);
        //
        // console.log(">>> account found:", account);
        // console.log({ validPassword });

        if (!account) {
          // (1) If account is not found
          res.send({
            message: `Login failed because account with username '${
              body.username
            }' is not found`
          });
        } else if (!validPassword) {
          // (2) If the found account is logged in with unmatched password
          res.send({
            message: `Sign in failed because password of '${
              account.username
            }' is not match.`
          });
        } else {
          // (3) If the found account is matched with the password
          // console.log({ account });

          // (4) Create token content and config
          let content = {
            payload: {
              // or claims
              iss: process.env.URL, // ISSUER: DOMAIN/URL of the service
              sub: account._id, // SUBJECT: OID/UID/UUID/GUID
              id: account.id, // ACCOUNTID: Sequential ID
              username: account.username, // EMAIL: Email address
              userId: account._account //_id: ID user
            },
            secret: process.env.JWT_SECRET,
            options: {
              expiresIn: "30d" // EXPIRATION: 30 days
            }
          };
          console.log({ content });

          // (5) Generate a token
          const token = helpers.generateJWT(content);
          // console.log({ token })

          // (6) Set logged in status
          helpers.setLoggedIn(account, true);
          // console.log(account.name
          // (7) Finally send that token
          res.send({
            message: "You are logged in",
            username: body.username,
            name: account.name,
            profile_picture: account.profile_picture,
            id: account.id,
            userId: account._account,
            token: token
          });
        }
      })
      .catch(err => {
        // If there's an error while finding the account
        console.log(err);
        if (err)
          res.send({
            message: `Something went wrong when try to logging in`
          });
      });
    // Finished sign in
  },

  // ---------------------------------------------------------------------------
  // GET /accounts/logout
  // logout: (req, res) => {
  //   const decoded = {
  //     id: req.decoded.id
  //   }
  //
  //   // (6) Set logged in status
  //   helpers.setLoggedIn(decoded, false)
  //
  //   res.send({
  //     message: `User with id: ${decoded.id} is logged out`
  //   })
  // },
  // ---------------------------------------------------------------------------
  // GET /accounts
  getReviewHistory: (req, res) => {
    Account.find({
      reviews: { $elemMatch: { _account: "5a8d300c4cf01a3ee36818a1" } }
    })
      .populate({
        path: "posts"
      })
      .exec((err, accounts) => {
        res.send({
          data: accounts
        });
      });
  },

  // ---------------------------------------------------------------------------
  // GET /accounts/get_user_detail
  getUserDetail: (req, res) => {
    // res.send(req.decoded.id)
    Account.find({ id: req.decoded.id }).exec((err, accounts) => {
      var decoded = jwt.decode(token);

      // get the decoded payload and header
      var decoded = jwt.decode(token, { complete: true });
      console.log(decoded.id);
      res.send({
        data: accounts
      });
    });
  }
};

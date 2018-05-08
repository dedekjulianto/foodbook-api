const mongoose = require("mongoose");
const sequence = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;
const Account = require("../accounts/model");

// PRECONFIGURATION ------------------------------------------------------------

const modelName = "foods";

// SCHEMA ----------------------------------------------------------------------

const schema = new Schema(
  {
    _account: {
      type: Schema.Types.ObjectId,
      ref: "Account"
    },
    name: {
      type: String
    },
    overview: {
      type: String,
      default: ""
    },
    price: {
      type: Number,
      default: ""
    },
    photos: [],
    address: {
      street: {
        type: String,
        default: ""
      },
      city: {
        type: String,
        default: ""
      }
    },
    coordinate: {
      latitude: {
        type: Number,
        default: 0
      },
      longitude: {
        type: Number,
        default: 0
      }
    },
    reviews: [
      {
        _account: {
          type: Schema.Types.ObjectId,
          ref: "Account"
        },
        comment: {
          type: String
        },
        rating: {
          type: Number,
          enum: [1, 2, 3, 4, 5]
        }
      }
    ]
  },
  { timestamps: true }
);

// GENERATED FIELDS ------------------------------------------------------------

schema.plugin(sequence, {
  id: "food_counter",
  inc_field: "id"
});

// DATA POPULATION -------------------------------------------------------------

schema.pre("find", function(next) {
  next();
});

schema.pre("findOne", function(next) {
  next();
});

schema.pre("update", function() {
  this.update(
    {},
    {
      $set: {
        updatedAt: new Date()
      }
    }
  );
});

// REGISTER THE SCHEMA INTO MODEL ----------------------------------------------

module.exports = mongoose.model(modelName, schema);

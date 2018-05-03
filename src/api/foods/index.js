const express = require("express");
const router = express.Router();

const controller = require("./controller");

router.get("/", controller.get);
router.get("/:id", controller.getById);
router.post("/", controller.post);
router.delete("/", controller.delete);
router.delete("/:id", controller.deleteById);
router.put("/:id", controller.putById);

// router.post("/add_review/:id", controller.addReviewById);

// router.get("/review_history/:id", controller.getReviewHistory);

// router.get("/get_restaurant_by_user/:id", controller.getRestaurantByUser);

module.exports = router;

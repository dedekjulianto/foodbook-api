const express = require("express");
const router = express.Router();
const controller = require("./controller");
const helpers = require("../../helpers");

router.post("/", helpers.isAuthenticated, controller.post);
router.get("/", controller.get);
router.get("/search", controller.getByQuery);
router.get("/:id", controller.getById);
router.get("/review_history/:id", controller.getReviewHistory);
router.get("/get_Food_by_user/:id", controller.getFoodByUser);
router.put("/:id", helpers.isAuthenticated, controller.putById);
router.put("/add_review/:id", controller.addReviewById);
router.delete("/", helpers.isAuthenticated, controller.delete);
router.delete("/:id", helpers.isAuthenticated, controller.deleteById);

module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post("/", controller.post);
router.get("/", controller.get);
router.get("/:id", controller.getById);
router.get("/review_history/:id", controller.getReviewHistory);
router.get("/get_Food_by_user/:id", controller.getFoodByUser);
router.put("/:id", controller.putById);
router.put("/add_review/:id", controller.addReviewById);
router.delete("/", controller.delete);
router.delete("/:id", controller.deleteById);

module.exports = router;

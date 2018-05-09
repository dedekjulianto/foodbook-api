const express = require("express");
const router = express.Router();

const controller = require("./controller");
// const helpers = require("../../helpers")

router.post("/signin", controller.login);
// router.put("/logout", controller.logout)

router.get("/", controller.get);
router.get("/:id", controller.getById);
// router.get("/bypass", controller.getBypass);

router.post("/", controller.register);

router.delete("/", controller.delete);
router.delete("/:id", controller.deleteById);

// router.get("/review_history/:id", controller.getReviewHistory)

// router.post("/get_user_detail", controller.getUserDetail)

module.exports = router;

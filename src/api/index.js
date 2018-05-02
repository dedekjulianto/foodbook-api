const express = require("express")
const router = express.Router()

const controller = require("./controller")

router.get("/", controller.get)
router.get("/api", controller.get)

module.exports = router

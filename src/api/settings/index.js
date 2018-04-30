const express = require("express")
const router = express.Router()

const controller = require("./controller")

const helpers = require("../../helpers")

router.get("/", helpers.isAuthenticated, controller.get)

module.exports = router

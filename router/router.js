const express = require("express")
const router = express.Router()
const rest_controller = require("../controller/rest_controller")



router.get("/wipo",rest_controller.wipo)
router.get("/",rest_controller.index)
router.get("/:id",rest_controller.getDetails)


module.exports = router
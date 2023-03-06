const router = require("express").Router()
const { addAddress, activeAddress, removeAddress, AllAddress } = require("../Controller/Address_Controller")
const { isAuth } = require("../middleware/isAuth")
router.use(isAuth)
router.post("/add", addAddress)
router.post("/all", AllAddress)
router.put("/active", activeAddress)
router.delete("/delete", removeAddress)
module.exports = router
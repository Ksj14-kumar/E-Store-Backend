
const router = require("express").Router()
const Item_controller = require("../Controller/Item_Controller")
const { isAuth } = require("../middleware/isAuth")
router.post("/add", isAuth,Item_controller.AddItem)
router.delete("/delete/:itemId", isAuth,Item_controller.DeleteItem)
router.post("/all/:userId", isAuth,Item_controller.GetAllItems)
router.get("/products", Item_controller.GetAllProducts)
router.get("/qr", Item_controller.QueryItems)


module.exports = router

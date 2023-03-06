const express = require('express');
const { OrderItems } = require('../Controller/Order_Controller');
const { isAuth } = require('../middleware/isAuth');
const router = express.Router()
router.post("/",isAuth, OrderItems)
module.exports = router
const express = require('express');
const router = express.Router()
const { checkout_session, WebHook } = require('../Controller/Stripe_Payment_Controller');
const { isAuth } = require('../middleware/isAuth');
router.use(isAuth)
router.post('/create-checkout-session', checkout_session);
router.post('/webhook', WebHook);
module.exports = router
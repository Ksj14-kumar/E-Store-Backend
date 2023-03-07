const express = require('express');
const router = express.Router()
const { checkout_session, WebHook } = require('../Controller/Stripe_Payment_Controller');
const { isAuth } = require('../middleware/isAuth');
router.post('/create-checkout-session', isAuth,checkout_session);
// TODO:not protect stripe webhook
router.post('/webhook',WebHook);
module.exports = router
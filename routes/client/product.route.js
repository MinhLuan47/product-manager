const express = require('express')
const router = express.Router()
const controller = require('../../controller/client/product.controller')

// [GET] products
router.get('/', controller.product)

module.exports = router

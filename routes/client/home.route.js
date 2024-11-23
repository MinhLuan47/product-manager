const express = require('express')
const router = express.Router()
const controller = require('../../controller/client/home.controller')

// [GET] home
router.get('/', controller.index)

module.exports = router

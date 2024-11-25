const express = require('express')
const multer = require('multer')

const router = express.Router()

const validateProduct = require('../../validates/admin/productValidate')
const controller = require('../../controller/admin/product.controller')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/uploads/')
//     },
//     filename: function (req, file, cb) {
//         const fileName = `${Date.now()}-${file.originalname}`
//         cb(null, fileName)
//     },
// })

const fileUpload = multer()
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')

router.get('/', controller.product)

router.patch('/change-multi-type', controller.updateMulti)

router.patch('/:status/:id', controller.updateStatus)

router.patch('/changePosition/:id/:value', controller.updatePosition)

router.delete('/delete/:id', controller.deleteOneProduct)

router.get('/create', controller.getProduct)
router.get('/edit/:id', controller.getOneProduct)

router.post(
    '/create',
    fileUpload.single('thumbnail'),
    uploadCloud.upload,
    validateProduct.createProduct,
    controller.createProduct,
)

module.exports = router

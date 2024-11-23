const Product = require('../../models/product.model')

module.exports.product = async (req, res) => {
    const products = await Product.find({})
    res.render('client/pages/products/index', { title: 'Hey, PUG !', products })
}

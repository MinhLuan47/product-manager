const homeRoutes = require('./home.route')
const productRoutes = require('./product.route')

module.exports = (app) => {
    // [GET] home
    app.use('/', homeRoutes)

    app.use('/products', productRoutes)
}

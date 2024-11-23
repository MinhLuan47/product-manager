const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const productSchema = new mongoose.Schema(
    {
        title: String,
        category: String,
        price: Number,
        discountPercentage: Number,
        rating: Number,
        stock: Number,
        thumbnail: String,
        position: Number,
        deleted: { type: Boolean, default: false },
        slug: {
            type: String,
            slug: 'title',
            unique: true,
        },
        status: String,
        deletedAt: Date,
    },
    { timestamps: true },
)

const Product = mongoose.model('Product', productSchema, 'products')

module.exports = Product

const Product = require('../../models/product.model')

module.exports = {
    product: async (req, res) => {
        const options = {
            deleted: false,
        }
        let optionButtons = [
            {
                title: 'Tất cả',
                status: '',
            },
            {
                title: 'Hoạt động',
                status: 'active',
            },
            {
                title: 'Dừng hoạt động',
                status: 'disable',
            },
        ]

        // status
        let status = req.query.status
        if (status) {
            options.status = status
        } else {
            status = ''
        }
        // status

        // search
        const keywords = req.query.keywords
        const keywordsRegExp = new RegExp(keywords, 'i')
        if (keywords) {
            options.title = keywordsRegExp
        } else {
            delete options.title
        }
        // end search

        // pagination
        const page = {
            limitOnePage: 3,
        }
        page.currentPage = req.query.page ?? 1
        const skip = (+page.currentPage - 1) * page.limitOnePage
        const totalProduct = await Product.countDocuments()
        page.totalPage = Math.ceil(totalProduct / page.limitOnePage)

        // end pagination

        // await Product.updateMany({}, { $set: { position: '' } })

        // const docs = await Product.find({})
        // for (let i = 0; i < docs.length; i++) {
        //     await Product.updateOne({ _id: docs[i]._id }, { $set: { position: i + 1 } })
        // }

        const products = await Product.find(options).limit(page.limitOnePage).skip(skip).sort({ position: 'asc' })

        res.render('admin/pages/products/index', {
            title: 'Trang sản phẩm',
            optionButtons,
            products,
            keywords,
            status,
            page,
        })
    },

    //
    updateStatus: async (req, res) => {
        try {
            await Product.updateOne({ _id: req.params.id }, { status: req.params.status })
        } catch (e) {
            console.log(e)
        }
        req.flash('success', 'Thay đổi trạng thái thành công !')

        res.redirect(req.get('Referrer') || '/')
    },

    updatePosition: async (req, res) => {
        try {
            await Product.updateOne({ _id: req.params.id }, { position: req.params.value })
        } catch (e) {
            console.log(e)
        }
        req.flash('success', 'Thay đổi thứ tự thành công !')

        res.send({ success: true, value: req.params.value })
    },

    updateMulti: async (req, res) => {
        let ids = req.body.ids.slice(0, -1)
        ids = ids.split(',')
        const typeValue = req.body.type
        const optionsUpdate = {}

        switch (typeValue) {
            case 'delete-multi':
                optionsUpdate.deleted = true
                optionsUpdate.deletedAt = new Date()
                break
            default:
                optionsUpdate.status = typeValue
        }

        try {
            await Product.updateMany({ _id: { $in: ids } }, { $set: optionsUpdate })
            req.flash('success', 'Thay đổi trạng thái thành công !')

            res.json({ message: 'ok' })
        } catch (e) {
            res.json({ message: 'error' + e })
        }
    },

    deleteOneProduct: async (req, res) => {
        try {
            await Product.updateOne({ _id: req.params.id }, { deleted: true })
            res.send({ success: true, message: 'Đã xóa thành công' })
        } catch (e) {
            res.send({ success: false, message: e })
        }
    },

    getProduct: async (req, res) => {
        res.render('admin/pages/products/create', {
            title: 'Tạo sản phẩm',
        })
    },

    getOneProduct: async (req, res) => {
        const id = req.params.id
        if (id) {
            const [products] = await Product.find({ _id: id })
            res.render('admin/pages/products/edit', {
                title: 'Cập nhật sản phẩm',
                products,
            })
        } else {
            res.redirect(req.get('Referrer') || '/')
        }
    },
    createProduct: async (req, res) => {
        req.body.position = (await Product.countDocuments()) + 1
        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`
        }
        const newItem = new Product(req.body)

        try {
            await newItem.save()
            req.flash('success', 'Đã thêm thành công !')
            res.redirect('/admin/products')
        } catch (e) {
            console.log(e)
            res.json({ success: false })
        }
    },
}

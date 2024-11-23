module.exports.dashboard = (req, res) => {
    // res.render('admin/pages/home/dashboard',this.dashboard)
    res.render('admin/pages/dashboard/index', {
        title: 'Hey,PUG 1',
    })
}

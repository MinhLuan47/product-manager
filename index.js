require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')

const route = require('./routes/client/index.route')
const routeAdmin = require('./routes/admin/index.route')
const database = require('./config/database')
const systemConfig = require('./config/system')

const app = express()
const port = process.env.PORT
const keyCookie = process.env.KEY_COOKIE
database.connect()

app.set('views', `${__dirname}/views`) // Tìm đến thư mục tên là views
app.set('view engine', 'pug') // set  engine

// app locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(cookieParser(keyCookie))
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'defaultSecret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    }),
)
app.use(flash())
app.use((req, res, next) => {
    res.locals.message = req.flash()
    next()
})

route(app)
routeAdmin(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port} `)
})

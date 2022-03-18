const app = require('express')(),
  rateLimit = require('express-rate-limit'),
  pageLimit = global.pageLimit = {
    normal: rateLimit({ windowMs: 1000, max: 2, message: { status: "API limit exceeded" } }),
    api: rateLimit({ windowMs: 10 * 1000, max: 1, message: { status: "API limit exceeded" } })
  }

global.ytdl = require('ytdl-core')
global.yts = require('yt-search')
global.config = require('./config.json')
global.randomstring = require("randomstring")
global.delay = require('delay')
global.Functions = require("./Functions")

app.use(pageLimit.normal)
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('body-parser').json())
app.use(require('express').static(require('path').join(__dirname, './views')))
app.use(require("cookie-session")({ cookie: { secure: true, maxAge: 60000 }, secret: "~drizzlydeveloper", resave: false, saveUninitialized: true }))

app.set('view engine', 'ejs')
app.set('trust proxy', true)
app.set('views', require('path').join(__dirname, './views/'))

require("./Functions").pages.function(app)
require("./Functions").Connection(require('http').createServer(app))
require('dayjs/locale/tr')
require("dayjs").extend(require('dayjs/plugin/timezone'))
require("dayjs").extend(require('dayjs/plugin/utc'))
require("dayjs").locale('tr')
let LocalTime, pages, translate, array = {}

module.exports.Connection = async function Connection(server) {
    function ConnectionStatus(Status, Detail) { this.Status = Status, this.Detail = Detail }
    server.listen(process.env.PORT || 5550, async function (err) {
        if (err) array.website = new ConnectionStatus("Not Connected", `Host: unknown - Port: unknown`)
        array.website = new ConnectionStatus("Connected", `Host: ${process.env.PORT ? config.host : config.localhost}`)
    })
    setTimeout(async () => console.table(array), 1500)
}

module.exports.pages = pages = {
    function: async function func(app) {
        app.get(["/", "/video/bul/:search", "/video/izle/:videoid"], require("./Index.js"))
        app.post(["/", "/video/bul/*", "/video/izle/*"], require("./Index.js"))
        app.use(async function (req, res) { await pages.error(req, res) })
    },
    error: async function error(req, res) {
        res.status(404).send("!! Error")
    }
}

module.exports.day = LocalTime = async function Day(date, time, time_data, userCreatedAt) {
    let module = require("dayjs"), data, f1 = "DD MMMM YYYY HH.mm.ss", f2 = "DD MMMM YYYY", f3 = "HH.mm.ss"
    let day = time_data ? module(time_data).tz('Asia/Istanbul') : module().tz('Asia/Istanbul')
    if (date == true && time == true) data = day.format(f1)
    if (date == true && time !== true) data = day.format(f2)
    if (date !== true && time == true) data = day.format(f3)
    else data = day.format(f1)
    return new Promise((resolve) => resolve(userCreatedAt && time_data == undefined ? null : data))
}

module.exports.translate = translate = async function Translate(toLang, text) {
    let module = require('translate-google')
    return new Promise(async (resolve) => {
        resolve(toLang && text ? module(text, { to: toLang }).then((res) => res).catch((err) => err) : null)
    })
}
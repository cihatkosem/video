module.exports = async function index(req, res, next) {
    let params = req.params, body = req.body
    if (body.videoname) return res.redirect(`/video/bul/${body.videoname}`)
    if (req.url == "/") return res.render('index', { search: null, video: null, videos: null, related: null })
    let search = params.search ? await yts(params.search) : null
    let videos = search ? search.videos.slice(0, 15) : null
    if (videos) return res.render('index', { search: params.search, video: null, videos, related: null })

    let findvideo = params.videoid ? await ytdl.getInfo(`https://www.youtube.com/watch?v=${params.videoid}`) : null
    let formats = findvideo ? findvideo.formats : null
    let mp4 = formats ? formats.filter(f => f.container == "mp4" && f.hasAudio == true && f.hasVideo == true) : null
    let mp3 = formats ? formats.filter(f => f.container == "webm" && f.mimeType == `audio/webm; codecs="opus"`) : null

    let details = findvideo.player_response.videoDetails
    let video = {
        title: details.title,
        videoId: details.videoId,
        channelId: details.channelId,
        lengthSeconds: details.lengthSeconds,
        viewCount: details.viewCount,
        author: details.author,
        isLiveContent: details.isLiveContent
    }
    return res.render('index', { search: params.search, video, videos: null, related: findvideo.related_videos })
}
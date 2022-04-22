module.exports = async function index(req, res, next) {
    try {
        let query = req.query

        if (req.url == "/") return res.render('index', { search: null, video: null, videos: null, related: null })

        let search = query.search ? await yts(query.search) : null
        let videos = search ? search.videos.slice(0, 15) : null

        if (videos) return res.render('index', { search: query.search, video: null, videos, related: null })

        let findvideo = query.watch ? await ytdl.getInfo(`https://www.youtube.com/watch?v=${query.watch}`) : null,
            formats = findvideo ? findvideo.formats : null,
            mp4 = formats ? formats.filter(f => f.container == "mp4" && f.hasAudio == true && f.hasVideo == true) : null,
            mp3 = formats ? formats.filter(f => f.container == "webm" && f.mimeType == `audio/webm; codecs="opus"`) : null

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
        return res.render('index', { search: query.search, video, videos: null, related: findvideo.related_videos })
    } catch (error) {
        return res.status(404).render("error")
    }
}